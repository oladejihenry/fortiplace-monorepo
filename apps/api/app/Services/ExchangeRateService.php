<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ExchangeRateService
{
    private string $apiKey;
    private string $baseUrl;
    private const CACHE_DURATION = 86400; // 24 hours

    public const SUPPORTED_CURRENCIES = ['NGN', 'GHS', 'KES', 'UGX', 'ZAR', 'XAF', 'GBP', 'USD'];
    public const BASE_CURRENCY = 'NGN';

    public function __construct()
    {
        $this->apiKey = config('services.wise.api_key');
        $this->baseUrl = config('services.wise.base_url');
    }

    public function getBulkRates(array $conversions): array
    {
        try {
            $results = [];
            foreach ($conversions as $conversion) {
                $fromCurrency = $conversion['from'];
                $toCurrency = $conversion['to'];
                $amount = $conversion['amount'];

                $cacheKey = "wise_rate_{$fromCurrency}_{$toCurrency}";

                $rate = Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($fromCurrency, $toCurrency) {
                    return $this->fetchBaseRate($fromCurrency, $toCurrency);
                });

                $results[] = [
                    'from' => $fromCurrency,
                    'to' => $toCurrency,
                    'rate' => $rate,
                    'calculated_amount' => round($rate * $amount, 2)
                ];
            }

            return $results;
        } catch (\Exception $e) {
            Log::error('Wise API Error: ' . $e->getMessage());
            return [];
        }
    }

    public function calculatePrices(float $basePrice): array
    {
        $cacheKey = "wise_prices:{$basePrice}";

        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($basePrice) {
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

            Log::info('Wise rates calculated and cached', [
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
                    'price' => $rate['calculated_amount'],
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

    protected function fetchBaseRate(string $fromCurrency, string $toCurrency): float
    {
        try {

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey
            ])->get("{$this->baseUrl}/rates", [
                'source' => $fromCurrency,
                'target' => $toCurrency
            ]);

            Log::info('Wise API Response: ' . $response->body());

            if (!$response->successful()) {
                Log::error('Wise API Error: ' . $response->body());
                return 0;
            }

            $rates = $response->json();
            if (empty($rates)) {
                Log::error('Wise API returned empty rates');
                return 0;
            }

            return $rates[0]['rate'];
        } catch (\Exception $e) {
            Log::error('Wise API Error: ' . $e->getMessage());
            return 0;
        }
    }
}
