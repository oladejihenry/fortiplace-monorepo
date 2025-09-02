<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Store;
use Symfony\Component\HttpFoundation\Response;

class EnsureStoreIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //Get the store
        $store = $request->route('store');

        //Check if store is active
        if ($store instanceof Store) {
            if (!$store->is_active || $store->user->is_banned) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Store is not active',
                        'status' => 'inactive',
                    ], 404);
                }
                return redirect()->route('login')->with('error', 'Store is not active');
            }
        }
        return $next($request);
    }
}
