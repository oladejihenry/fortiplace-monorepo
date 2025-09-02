<?php

namespace App\Services;

use App\Services\PaymentGateway\PaymentGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Uuid;

class PawapayService implements PaymentGatewayInterface
{
    private string $secretKey;

    private string $baseUrl;

    // Supported currencies
    public const SUPPORTED_CURRENCIES = ['XAF', 'XOF'];

    public const BASE_CURRENCY = 'NGN';

    public function __construct()
    {
        $this->secretKey = config('services.pawapay.secret_key');
        $this->baseUrl = config('services.pawapay.base_url');
    }

    public function getSupportedCurrencies(): array
    {
        return self::SUPPORTED_CURRENCIES;
    }

    public function initializeTransaction(array $data): array
    {
        try {
            $amount = $this->formatAmountForCurrency($data['amount'], $data['currency'] ?? 'XAF');
            $payload = [
                'depositId' => $this->generateUuid(),
                'amount' => $amount,
                'returnUrl' => $data['callback_url'] . '?reference=' . $data['reference'],
                // 'msisdn' => $data['phone'],
                'country' => $this->getCurrencyCountryCode($data['currency'] ?? 'XAF'),
                'language' => 'FR',
                'statementDescription' => substr($data['reference'], 0, 22),
                'reason' => ($data['narration'] ?? 'Product Purchase'),
                'metadata' => [
                    [
                        'fieldName' => 'reference',
                        'fieldValue' => $data['reference'],
                    ],
                    [
                        'fieldName' => 'customerName',
                        'fieldValue' => $data['metadata']['customer_name'] ?? 'Customer',
                    ],
                    [
                        'fieldName' => 'customerEmail',
                        'fieldValue' => $data['email'],
                        'isPII' => true,
                    ],
                ],
            ];

            Log::info('PaywayPayService Request:', $payload); // Fixed logging

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . 'v1/widget/sessions', $payload);

            Log::info('PaywayPayService Response:', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            if (! $response->successful()) {
                $errorData = $response->json();
                Log::error('PaywayPayService Error:', $errorData);
                throw new \Exception('Failed to initialize transaction: ' . ($errorData['message'] ?? 'Unknown error'));
            }

            $responseData = $response->json();

            if (! $responseData || ! isset($responseData['redirectUrl'])) {
                Log::error('PaywayPayService: Invalid response structure', $responseData);
                throw new \Exception('Invalid response from payment gateway');
            }

            return [
                'status' => true,
                'payment_url' => $responseData['redirectUrl'],
                'depositId' => $payload['depositId'],
            ];
        } catch (\Exception $e) {
            Log::error('PaywayPayService Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifyTransaction(string $reference): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . 'v1/deposits/' . $reference);

            if (! $response->successful()) {
                Log::error('PaywayPayService Error:', $response->json());
                throw new \Exception('Failed to verify transaction: ' . ($response->json()['errorMessage'] ?? 'Unknown error'));
            }

            $responseData = $response->json();

            // Log the actual response structure for debugging
            Log::info('PaywayPayService Verification Response:', [
                'reference' => $reference,
                'response' => $responseData
            ]);

            //Handle empty response
            if (empty($responseData) || (is_array($responseData) && count($responseData) === 0)) {
                Log::info('PaywayPayService: Empty response, transaction may still be processing', [
                    'reference' => $reference
                ]);

                return [
                    'status' => 'processing',
                    'amount' => 0,
                    'reference' => $reference,
                    'currency' => 'XAF',
                    'transaction_id' => $reference,
                    'gateway_response' => $responseData,
                    'metadata' => [],
                    'message' => 'Transaction is still processing or not yet available for verification'
                ];
            }

            $transactionData = $responseData[0] ?? $responseData;

            // Handle case where transactionData is still empty after extraction
            if (empty($transactionData) || !is_array($transactionData)) {
                Log::warning('PaywayPayService: Transaction data is empty or invalid', [
                    'reference' => $reference,
                    'transactionData' => $transactionData
                ]);

                return [
                    'status' => 'processing',
                    'amount' => 0,
                    'reference' => $reference,
                    'currency' => 'XAF',
                    'transaction_id' => $reference,
                    'gateway_response' => $responseData,
                    'metadata' => [],
                    'message' => 'Transaction data not yet available'
                ];
            }

            // Check if status field exists
            if (!isset($transactionData['status'])) {
                Log::warning('PaywayPayService: Missing status field, treating as processing', [
                    'reference' => $reference,
                    'transactionData' => $transactionData
                ]);

                return [
                    'status' => 'processing',
                    'amount' => $transactionData['requestedAmount'] ?? $transactionData['depositedAmount'] ?? 0,
                    'reference' => $transactionData['depositId'] ?? $reference,
                    'currency' => $transactionData['currency'] ?? 'XAF',
                    'transaction_id' => $transactionData['depositId'] ?? $reference,
                    'gateway_response' => $transactionData,
                    'metadata' => $transactionData['metadata'] ?? [],
                    'message' => 'Transaction status not yet available'
                ];
            }

            $status = match ($transactionData['status']) {
                'COMPLETED' => 'successful',
                'SUBMITTED', 'ENQUEUED' => 'processing',
                'FAILED' => 'failed',
                'CANCELLED' => 'cancelled',
                default => 'processing'
            };

            return [
                'status' => $status,
                'amount' => $transactionData['depositedAmount'] ?? $transactionData['requestedAmount'] ?? 0,
                'reference' => $transactionData['depositId'] ?? $reference,
                'currency' => $transactionData['currency'] ?? 'XAF',
                'transaction_id' => $transactionData['depositId'] ?? $reference,
                'gateway_response' => $transactionData,
                'metadata' => $transactionData['metadata'] ?? [],
            ];
        } catch (\Exception $e) {
            Log::error('PaywayPayService Exception: ' . $e->getMessage(), [
                'reference' => $reference,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    // generate uuid
    private function generateUuid(): string
    {
        return Uuid::uuid4()->toString();
    }

    private function getCurrencyCountryCode(string $currency): string
    {
        return match ($currency) {
            'XAF' => 'CMR', // Cameroon
            'XOF' => 'SEN', // Senegal
            default => 'CMR'
        };
    }

    private function formatAmountForCurrency(int $amountInCents, string $currency): string
    {
        return match ($currency) {
            'XAF', 'XOF' => number_format($amountInCents, 0, '.', ''), // No decimals, but as string
            default => number_format($amountInCents / 100, 2, '.', '') // 2 decimal places for other currencies
        };
    }
}
