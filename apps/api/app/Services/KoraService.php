<?php

namespace App\Services;

use App\Services\PaymentGateway\PaymentGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KoraService implements PaymentGatewayInterface
{
    private string $secretKey;
    private string $baseUrl = 'https://api.korapay.com/merchant/api/v1';

    //Supported currencies
    public const SUPPORTED_CURRENCIES = ['XAF'];
    public const BASE_CURRENCY = 'NGN';

    public function __construct()
    {
        $this->secretKey = config('services.kora.secret_key');
    }

    public function getSupportedCurrencies(): array
    {
        return self::SUPPORTED_CURRENCIES;
    }

    public function initializeTransaction(array $data): array
    {
        try {
            // if (app()->environment('production')) {
            //     $notificationUrl = route('webhooks.kora');
            // } else {
            //     $notificationUrl = env('KORA_WEBHOOK');
            // }
            $data = [
                'amount' => $data['amount'] / 100,
                'redirect_url' => $data['callback_url'],
                'currency' => $data['currency'],
                'reference' => $data['reference'],
                'narration' => 'Payment for ' . $data['product_name'],
                'customer' => [
                    'name' => $data['metadata']['customer_name'] ?? 'Customer',
                    'email' => $data['email']
                ],
                'notification_url' => env('KORA_WEBHOOK'),
                'merchant_bears_cost' => true
            ];

            Log::info('Kora Payment Initialization Request', [
                'payload' => $data,
                'endpoint' => $this->baseUrl . '/charges/initialize'
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/charges/initialize', $data);

            if (!$response->successful()) {
                Log::error('Kora Payment Initialization Failed', [
                    'status' => $response->status(),
                    'response' => $response->json(),
                    'payload' => $data
                ]);
                throw new \Exception('Failed to initialize transaction: ' .
                    ($response->json()['message'] ?? 'Unknown error'));
            }

            $responseData = $response->json();

            Log::info('Kora Payment Initialization Response', [
                'response' => $responseData
            ]);

            return [
                'status' => true,
                'payment_url' => $responseData['data']['checkout_url'],
                'reference' => $responseData['data']['reference'] ?? $data['reference']
            ];
        } catch (\Exception $e) {
            Log::error('Kora Service Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
    public function verifyTransaction(string $reference): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->secretKey,
            'Content-Type' => 'application/json',
        ])->get($this->baseUrl . '/charges/' . $reference);

        if (!$response->successful()) {
            Log::error('Kora Transaction Verification Failed', [
                'status' => $response->status(),
                'response' => $response->json(),
                'reference' => $reference
            ]);
            throw new \Exception('Failed to verify transaction: ' .
                ($response->json()['message'] ?? 'Unknown error'));
        }

        $data = $response->json()['data'];

        Log::info('Kora Transaction Verification Response', [
            'response' => $data
        ]);

        return [
            'status' => $data['status'],
            'amount' => $data['amount'],
            'currency' => $data['currency'],
        ];
    }
}
