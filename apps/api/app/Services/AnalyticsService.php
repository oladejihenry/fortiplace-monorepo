<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductView;
use App\Models\ProductViewStat;
use App\Models\StoreViewStat;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AnalyticsService
{
    public function recordProductView(Product $product, array $viewData): void
    {
        try {
            DB::transaction(function () use ($product, $viewData) {

                //Record raw view
                ProductView::create([
                    'product_id' => $product->id,
                    'ip_address' => $viewData['ip_address'],
                    'user_agent' => $viewData['user_agent'],
                    'country' => $viewData['country'] ?? null,
                    'city' => $viewData['city'] ?? null,
                    'device_type' => $viewData['device_type'] ?? null,
                    'viewed_at' => now(),
                ]);

                //Update daily view stats
                dispatch(function () use ($product) {
                    $this->updateStats($product, 'daily', now()->startOfDay());

                    //Update monthly view stats
                    $this->updateStats($product, 'monthly', now()->startOfMonth());

                    //Update yearly view stats
                    $this->updateStats($product, 'yearly', now()->startOfYear());

                    //Update store view stats
                    $this->updateStoreStats($product->user_id);
                })->afterCommit();
            });
        } catch (\Exception $e) {
            Log::error('Error recording product view: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'exception' => $e
            ]);
            throw $e;
        }
    }

    public function getProductStats(Product $product, string $period = 'monthly'): array
    {
        $cacheKey = "product_stats_{$product->id}_{$period}";
        $cacheDuration = 3600; // Cache for 1 hour

        return Cache::remember($cacheKey, $cacheDuration, function () use ($product, $period) {
            return ProductViewStat::where('product_id', $product->id)
                ->where('period_type', $period)
                ->orderBy('period_date', 'desc')
                ->take(12)
                ->get()
                ->toArray();
        });
    }

    public function getStoreStats(string $userId, string $period = 'monthly'): array
    {
        $cacheKey = "store_stats_{$userId}_{$period}";
        $cacheDuration = 3600; // Cache for 1 hour

        return Cache::remember($cacheKey, $cacheDuration, function () use ($userId, $period) {
            return StoreViewStat::where('user_id', $userId)
                ->where('period_type', $period)
                ->orderBy('period_date', 'desc')
                ->take(12)
                ->get()
                ->toArray();
        });
    }

    private function updateStats(Product $product, string $periodType, Carbon $date): void
    {
        $stats = ProductViewStat::firstOrNew([
            'product_id' => $product->id,
            'period_type' => $periodType,
            'period_date' => $date,
        ]);

        $endDate = match ($periodType) {
            'daily' => $date->copy()->endOfDay(),
            'monthly' => $date->copy()->endOfMonth(),
            'yearly' => $date->copy()->endOfYear(),
            default => throw new \InvalidArgumentException('Invalid period type'),
        };

        $uniqueViews = ProductView::where('product_id', $product->id)
            ->where('viewed_at', '>=', $date)
            ->where('viewed_at', '<', $endDate)
            ->distinct('ip_address')
            ->count();

        $stats->views++;
        $stats->unique_views = $uniqueViews;
        $stats->save();
    }

    private function updateStoreStats(string $userId): void
    {
        $periods = [
            'daily' => now()->startOfDay(),
            'monthly' => now()->startOfMonth(),
            'yearly' => now()->startOfYear()
        ];

        foreach ($periods as $periodType => $date) {
            $stats = StoreViewStat::firstOrNew([
                'user_id' => $userId,
                'period_type' => $periodType,
                'period_date' => $date,
            ]);

            $endDate = match ($periodType) {
                'daily' => $date->copy()->endOfDay(),
                'monthly' => $date->copy()->endOfMonth(),
                'yearly' => $date->copy()->endOfYear(),
                default => throw new \InvalidArgumentException('Invalid period type'),
            };

            $uniqueViews = ProductView::whereHas('product', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
                ->where('viewed_at', '>=', $date)
                ->where('viewed_at', '<', $endDate)
                ->distinct('ip_address')
                ->count();

            $stats->views++;
            $stats->unique_views = $uniqueViews;
            $stats->save();
        }
    }
}
