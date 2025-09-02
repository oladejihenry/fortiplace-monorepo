<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Product;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Resources\StoreProductResource;

class StoreProductController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            'track.views',
            new Middleware('auth:sanctum', ['except' => ['index', 'show']]),
            new Middleware('store.active'),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Store $store): JsonResource
    {
        $products = $store->user->products()
            ->published()
            ->with(['user', 'activeFile'])
            ->latest()
            ->paginate();

        return StoreProductResource::collection($products);
    }


    /**
     * Display the specified resource.
     */
    public function show(Store $store, Product $product): JsonResource
    {
        if ($product->user_id !== $store->user_id) {
            abort(403);
        }

        return new StoreProductResource($product->load(['user', 'activeFile']));
    }

    public function indexByDomain($domain)
    {
        $store = $this->findStoreByDomain($domain);
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
                'status' => 'error',
            ], 404);
        }

        return $this->index($store);
    }

    public function showByDomain($domain, Product $product)
    {
        $store = $this->findStoreByDomain($domain);
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
                'status' => 'error',
            ], 404);
        }

        return $this->show($store, $product);
    }

    private function findStoreByDomain($domain)
    {
        // First try custom domain
        $store = Store::where('custom_domain', $domain)
            ->where('custom_domain_status', 'verified')
            ->where('is_active', true)
            ->first();

        if ($store) {
            return $store;
        }

        // Try subdomain
        $subdomain = $this->extractSubdomain($domain);
        if ($subdomain) {
            return Store::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();
        }

        return null;
    }

    private function extractSubdomain(string $domain): ?string
    {
        // If it's just a single word (no dots), treat as subdomain directly
        if (!str_contains($domain, '.')) {
            return $domain;
        }

        // Handle localhost case
        if (str_contains($domain, 'localhost')) {
            $parts = explode('.', $domain);
            return $parts[0] ?? null;
        }

        // Handle production domain case
        $rootDomain = env('FRONTEND_DOMAIN');
        if (str_ends_with($domain, $rootDomain)) {
            return str_replace('.' . $rootDomain, '', $domain);
        }

        return null;
    }
}
