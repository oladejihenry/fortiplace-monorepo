<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\AnalyticsService;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AnalyticsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }
    public function __construct(private AnalyticsService $analyticsService) {}

    public function productStats(Request $request, Product $product)
    {
        $period = $request->input('period', 'monthly');

        return response()->json([
            'stats' => $this->analyticsService->getProductStats($product, $period),
        ]);
    }

    public function storeStats(Request $request)
    {
        $period = $request->input('period', 'monthly');

        $user = $request->user();

        return response()->json([
            'stats' => $this->analyticsService->getStoreStats($user->id, $period),
        ]);
    }

    public function allStats(Request $request, Product $product)
    {
        $period = $request->input('period', 'monthly');

        return response()->json([
            'product_stats' => $this->analyticsService->getProductStats($product, $period),
            'store_stats' => $this->analyticsService->getStoreStats($period),
        ]);
    }
}
