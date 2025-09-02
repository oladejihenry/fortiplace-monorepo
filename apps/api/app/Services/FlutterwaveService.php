<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Services\PaymentGateway\PaymentGatewayInterface;

class FlutterwaveService implements PaymentGatewayInterface
{
    private string $secretKey;
    private string $baseUrl = 'https://api.flutterwave.com/v3';
    private const CACHE_DURATION = 3600; // 1 hour

    //Supported currencies
    public const SUPPORTED_CURRENCIES = ['NGN', 'GHS', 'KES', 'UGX', 'ZAR', 'XAF', 'GBP', 'USD'];
    public const BASE_CURRENCY = 'NGN';

    public function __construct()
    {
        $this->secretKey = config('services.flutterwave.secret_key');
    }

    public function getSupportedCurrencies(): array
    {
        return self::SUPPORTED_CURRENCIES;
    }

    public function initializeTransaction(array $data): array
    {
        try {
            $payload = [
                'tx_ref' => $data['reference'],
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? self::BASE_CURRENCY,
                'redirect_url' => $data['callback_url'],
                'customer' => [
                    'email' => $data['email'],
                    'name' => $data['metadata']['customer_name'] ?? 'Customer'
                ],
                'meta' => [
                    'order_id' => $data['metadata']['order_id'],
                    'items_count' => $data['metadata']['items_count']
                ],
                'customizations' => [

                    //use product name
                    'title' => config('app.name') . ' Payment',
                    'description' => 'Payment for digital products',
                    'logo' => config('app.logo') // Your app logo URL
                ]
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/payments', $payload);

            if (!$response->successful()) {
                Log::error('Flutterwave initialization failed', [
                    'error' => $response->json(),
                    'status' => $response->status()
                ]);

                throw new \Exception('Failed to initialize Flutterwave transaction: ' .
                    ($response->json()['message'] ?? 'Unknown error'));
            }

            $responseData = $response->json();

            Log::info('Flutterwave response data', ['responseData' => $responseData]);

            return [
                'status' => true,
                'payment_url' => $responseData['data']['link'],
                // 'transaction_id' => $responseData['data']['id']
            ];
        } catch (\Exception $e) {
            Log::error('Flutterwave Service Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifyTransaction(string $reference): array
    {
        try {


            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/transactions/verify_by_reference', [
                'tx_ref' => $reference
            ]);

            Log::info('Flutterwave verification response', ['response' => $response->json()]);


            if (!$response->successful()) {
                throw new \Exception('Failed to verify transaction');
            }


            $data = $response->json()['data'];

            return [
                'status' => $data['status'],
                'amount' => $data['amount'],
                'currency' => $data['currency'],
                // 'transaction_id' => $data['id'],
                'tx_ref' => $data['tx_ref'],
                'customer' => [
                    'email' => $data['customer']['email'],
                    'name' => $data['customer']['name']
                ],
                'meta' => $data['meta'] ?? [],
                'payment_type' => $data['payment_type'],
                'created_at' => $data['created_at']
            ];
        } catch (\Exception $e) {
            Log::error('Flutterwave verification error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getBulkRates(array $conversions)
    {
        try {
            $conversions = array_values($conversions);
            $batchReference = substr(str_replace(['-', '_'], '', bin2hex(random_bytes(16))), 0, 20);

            $payload = [
                'batch_reference' => $batchReference,
                'data' => $conversions
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/bulk-rates', $payload);

            if (!$response->successful()) {
                throw new \Exception('Failed to fetch bulk rates');
            }

            $initiateResponse = $response->json();
            $bulkRateId = $initiateResponse['data']['id'] ?? null;

            Log::info('Flutterwave bulk rate id', ['bulkRateId' => $bulkRateId]);

            if (!$bulkRateId) {
                throw new \Exception('Failed to get bulk rate id');
            }

            $maxAttempts = 10; // Increased attempts since we're checking for completion
            $attempt = 0;
            $delay = 1000; // Start with 1 second delay (in milliseconds)

            do {
                if ($attempt > 0) {
                    usleep($delay * 1000);
                    $delay = min($delay * 2, 5000); // Exponential backoff, max 5 seconds
                }

                $statusResponse = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->secretKey,
                    'Content-Type' => 'application/json',
                ])->get($this->baseUrl . '/bulk-rates?id=' . $bulkRateId);

                if ($statusResponse->successful()) {
                    $ratesData = $statusResponse->json();

                    if (!empty($ratesData['data'])) {
                        // Check if all rates are completed
                        $allCompleted = collect($ratesData['data'])->every(function ($rate) {
                            return $rate['status'] === 'completed' &&
                                $rate['rate'] !== null &&
                                $rate['to']['amount'] !== null;
                        });

                        if ($allCompleted) {
                            break;
                        }
                    }
                }
            } while (++$attempt < $maxAttempts);

            if ($attempt >= $maxAttempts) {
                throw new \Exception('Timeout while waiting for bulk rates to complete');
            }

            Log::info('Flutterwave rates data', ['rates' => $ratesData]);

            // Filter out any incomplete rates
            $completedRates = array_filter($ratesData['data'], function ($rate) {
                return $rate['status'] === 'completed' &&
                    $rate['rate'] !== null &&
                    $rate['to']['amount'] !== null;
            });

            if (empty($completedRates)) {
                throw new \Exception('No completed rates available');
            }

            return array_map(function ($rate) {
                return [
                    'from' => $rate['from']['currency'],
                    'to' => $rate['to']['currency'],
                    'rate' => $rate['rate'],
                    'calculated_amount' => $rate['to']['amount']
                ];
            }, $completedRates);
        } catch (\Exception $e) {
            Log::error('Flutterwave bulk rates error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function calculatePrices(float $basePrice): array
    {
        $cacheKey = "flw_prices:{$basePrice}";

        return Cache::store(env('CACHE_STORE'))->remember($cacheKey, self::CACHE_DURATION, function () use ($basePrice) {
            $conversions = array_map(function ($currency) use ($basePrice) {
                if ($currency === self::BASE_CURRENCY) return null;
                return [
                    'from' => self::BASE_CURRENCY,
                    'to' => $currency,
                    'amount' => $basePrice
                ];
            }, self::SUPPORTED_CURRENCIES);

            $conversions = array_filter($conversions);
            $rates = $this->getBulkRates($conversions);

            Log::info('Flutterwave rates calculated and cached', [
                'basePrice' => $basePrice,
                'rates' => $rates
            ]);

            $prices = [[
                'currency' => self::BASE_CURRENCY,
                'price' => $basePrice,
                'regularPrice' => null
            ]];

            foreach ($rates as $rate) {
                $prices[] = [
                    'currency' => $rate['to'],
                    'price' => round($rate['rate'] * $basePrice, 2),
                    'regularPrice' => null
                ];
            }

            return $prices;
        });
    }

    public function validateCurrency(string $currency): bool
    {
        return in_array(strtoupper($currency), self::SUPPORTED_CURRENCIES);
    }

    public function getTransactionFee(float $amount, string $currency = self::BASE_CURRENCY): float
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/transactions/fee', [
                'amount' => $amount,
                'currency' => $currency
            ]);

            if (!$response->successful()) {
                throw new \Exception('Failed to get transaction fee');
            }

            return $response->json()['data']['fee'];
        } catch (\Exception $e) {
            Log::error('Flutterwave fee calculation error: ' . $e->getMessage());
            return 0; // Return 0 if fee calculation fails
        }
    }

    public function validateBankAccount(string $bankCode, string $accountNumber)
    {
        $endpoint = "/accounts/resolve";

        //Body Parameters
        $body = [
            'account_number' => $accountNumber,
            'account_bank' => $bankCode,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . $endpoint, $body);

            if (!$response->successful()) {
                return false;
            }

            //return body
            return $response->json()['data'];
        } catch (\Exception $e) {
            Log::error('Flutterwave bank account validation error: ' . $e->getMessage());
            return false;
        }
    }


    public function initiateTransfer(array $data): array
    {
        $ref = $data['reference'] . '_' . uniqid();
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transfers', [
                'account_bank' => $data['account_bank'],
                'account_number' => $data['account_number'],
                'amount' => $data['amount'],
                'narration' => $data['narration'],
                'currency' => $data['currency'],
                'reference' => $ref,
                // 'callback_url' => $data['callback_url'],
                'debit_currency' => $data['debit_currency'],
            ]);

            if (!$response->successful()) {
                Log::error('Flutterwave transfer initialization failed', [
                    'error' => $response->json(),
                    'status' => $response->status()
                ]);

                return [
                    'status' => false,
                    'message' => $response->json()['message'] ?? 'Could not initiate transfer',
                ];
            }

            $responseData = $response->json();
            Log::info('Flutterwave transfer initiated', ['response' => $responseData]);

            return [
                'status' => true,
                'transaction_id' => $responseData['data']['id'],
                'reference' => $responseData['data']['reference'],
            ];
        } catch (\Exception $e) {
            Log::error('Flutterwave transfer error: ' . $e->getMessage());

            return [
                'status' => false,
                'message' => 'An error occurred while initiating the transfer: ' . $e->getMessage(),
            ];
        }
    }

    public function getBankList(): array
    {
        $cacheKey = 'flutterwave_banks_ng';
        $cacheDuration = 60 * 60 * 24 * 30; // 30 days

        return Cache::remember($cacheKey, $cacheDuration, function () {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->secretKey,
                    'Content-Type' => 'application/json',
                ])->get($this->baseUrl . '/banks/NG');

                if (!$response->successful()) {
                    throw new \Exception('Failed to get bank list');
                }


                $banks = $response->json()['data'];

                return $banks;
            } catch (\Exception $e) {
                Log::error('Flutterwave bank list error: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function retryTransfer(string $transferId): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/transfers/' . $transferId . '/retries');

            if (!$response->successful()) {
                throw new \Exception('Failed to retry transfer');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Flutterwave transfer retry error: ' . $e->getMessage());
            return [
                'status' => false,
                'message' => 'An error occurred while retrying the transfer: ' . $e->getMessage(),
            ];
        }
    }
}
