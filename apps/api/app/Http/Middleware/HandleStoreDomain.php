<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Store;

class HandleStoreDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $url = $request->fullUrl();
        Log::info('Full URL', ['url' => $url]);

        // For API routes, extract domain from the URL path
        if ($request->is('api/store/show/*')) {
            $path = $request->path();
            $domain = explode('api/store/show/', $path)[1] ?? null;

            Log::info('Extracted domain from path', ['domain' => $domain]);

            if ($domain) {
                // Handle localhost case
                if (str_contains($domain, 'localhost')) {
                    $subdomain = explode('.', $domain)[0];
                    Log::info('Localhost subdomain', ['subdomain' => $subdomain]);

                    $store = Store::where('subdomain', $subdomain)
                        ->where('is_active', true)
                        ->first();

                    if ($store) {
                        $request->merge(['store' => $store]);
                        return $next($request);
                    }
                }

                // Handle custom domain
                $store = Store::where('custom_domain', $domain)
                    ->where('custom_domain_status', 'verified')
                    ->where('is_active', true)
                    ->first();

                if ($store) {
                    $request->merge(['store' => $store]);
                    return $next($request);
                }

                // Handle subdomain
                $rootDomain = config('app.domain');
                if (str_ends_with($domain, $rootDomain)) {
                    $subdomain = str_replace('.' . $rootDomain, '', $domain);
                    $store = Store::where('subdomain', $subdomain)
                        ->where('is_active', true)
                        ->first();

                    if ($store) {
                        $request->merge(['store' => $store]);
                        return $next($request);
                    }
                }
            }
        }

        // For non-API routes, use the host
        $host = $request->getHost();
        Log::info('Host', ['host' => $host]);

        // Handle localhost development
        if (str_contains($host, 'localhost')) {
            $hostWithoutPort = explode(':', $host)[0];
            $subdomain = explode('.', $hostWithoutPort)[0];

            $store = Store::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();

            if ($store) {
                $request->merge(['store' => $store]);
                return $next($request);
            }
        }

        // Handle custom domains
        $store = Store::where('custom_domain', $host)
            ->where('custom_domain_status', 'verified')
            ->where('is_active', true)
            ->first();

        if ($store) {
            $request->merge(['store' => $store]);
            return $next($request);
        }

        // Handle subdomains
        $rootDomain = config('app.domain');
        if (str_ends_with($host, $rootDomain)) {
            $subdomain = str_replace('.' . $rootDomain, '', $host);
            $store = Store::where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();

            if ($store) {
                $request->merge(['store' => $store]);
                return $next($request);
            }
        }

        return response()->json(['message' => 'Store not found'], 404);
    }
}
