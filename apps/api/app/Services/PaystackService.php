<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\PaymentGateway\PaymentGatewayInterface;

class PaystackService implements PaymentGatewayInterface
{
    private string $secretKey;
    private string $baseUrl = 'https://api.paystack.co';

    private const SUPPORTED_CURRENCIES = ['NGN'];

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key');
    }

    public function getSupportedCurrencies(): array
    {
        return self::SUPPORTED_CURRENCIES;
    }

    public function initializeTransaction(array $data): array
    {
        Log::info('Paystack initializeTransaction', $data);
        try {
            // $currency = strtoupper($data['currency']);
            // if (!in_array($currency, self::SUPPORTED_CURRENCIES)) {
            //     throw new \Exception('Unsupported currency: ' . $currency);
            // }



            $payload = [
                'email' => $data['email'],
                'amount' => $data['amount'], // Convert to kobo/cents
                'currency' => "NGN",
                'callback_url' => $data['callback_url'],
                'reference' => $data['reference'],
                'metadata' => [
                    'order_id' => $data['metadata']['order_id'],
                    'custom_fields' => [
                        [
                            'display_name' => "Customer Name",
                            'variable_name' => "customer_name",
                            'value' => $data['metadata']['customer_name']
                        ],
                        [
                            'display_name' => "Items Count",
                            'variable_name' => "items_count",
                            'value' => $data['metadata']['items_count']
                        ]
                    ]
                ]
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transaction/initialize', $payload);

            if (!$response->successful()) {
                Log::error('Paystack initialization failed', [
                    'error' => $response->json(),
                    'status' => $response->status()
                ]);

                throw new \Exception('Failed to initialize Paystack transaction: ' .
                    ($response->json()['message'] ?? 'Unknown error'));
            }

            $responseData = $response->json();

            return [
                'status' => true,
                'payment_url' => $responseData['data']['authorization_url']
            ];
        } catch (\Exception $e) {
            Log::error('Paystack Service Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifyTransaction(string $reference): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secretKey,
            'Content-Type' => 'application/json',
        ])->get($this->baseUrl . '/transaction/verify/' . $reference);

        if (!$response->successful()) {
            throw new \Exception('Failed to verify transaction');
        }

        $data = $response->json()['data'];

        return [
            'status' => $data['status'],
            'amount' => $data['amount'],
            'currency' => $data['currency'],
        ];
    }

    public function validateBankAccount(string $bankCode, string $accountNumber): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Cache-Control' => 'no-cache',
            ])->get($this->baseUrl . '/bank/resolve?account_number=' . $accountNumber . '&bank_code=' . $bankCode);

            if (!$response->successful()) {
                return false;
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Paystack Service Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getTransferRecipientDetails(string $bankCode, string $accountNumber, string $currency, string $accountName): array
    {
        try {
            $payload = [
                'type' => 'nuban',
                'currency' => $currency,
                'account_number' => $accountNumber,
                'account_name' => $accountName,
                'bank_code' => $bankCode,
            ];
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transferrecipient', $payload);

            if (!$response->successful()) {
                throw new \Exception('Failed to get transfer recipient details');
            }

            return $response->json()['data'];
        } catch (\Exception $e) {
            Log::error('Paystack Service Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function initiateTransfer(array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transfer', $data);

            if (!$response->successful()) {
                throw new \Exception('Failed to initiate transfer');
            }

            return $response->json()['data'];
        } catch (\Exception $e) {
            Log::error('Paystack Service Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
