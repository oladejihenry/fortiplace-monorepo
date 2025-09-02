<?php

namespace App\Http\Controllers\Store;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Http\Resources\StoreResource;
use App\Http\Resources\StoreUserResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StoreController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('store.active'),
        ];
    }

    public function show(Store $store)
    {
        //check if store is active or banned
        if (!$store->is_active || $store->user->is_banned) {
            return response()->json([
                'message' => 'Store is not active',
                'status' => 'error',
            ], 404);
        }

        $store->user->load([
            'products' => fn($query) => $query->published()
                ->latest()
                ->take(8),
        ]);



        return response()->json([
            'store' => new StoreResource($store),
        ]);
    }

    public function user(Store $store)
    {
        return response()->json([
            'user' => new StoreUserResource($store->user),
        ]);
    }


    public function showByDomain($domain)
    {

        // First try custom domain
        $store = Store::where('custom_domain', $domain)
            ->where('custom_domain_status', 'verified')
            ->first();

        if ($store) {
            return $this->show($store);
        }

        // If not found by custom domain, try subdomain
        $subdomain = $this->extractSubdomain($domain);

        if ($subdomain) {
            $store = Store::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();

            if ($store) {
                return $this->show($store);
            }
        }

        // If no store found, return 404
        return response()->json([
            'message' => 'Store not found',
            'status' => 'error',
        ], 404);
    }

    public function userByDomain($domain)
    {
        $store = $this->findStoreByDomain($domain);
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
                'status' => 'error',
            ], 404);
        }

        return $this->user($store);
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
