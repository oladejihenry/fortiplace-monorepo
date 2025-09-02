<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsNotBanned
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && $request->user()->isBanned()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Your account has been suspended. Reason: ' . $request->user()->ban_reason,
                ], 403);
            }
            return redirect()->route('login')->with('error', 'Your account has been banned.');
        }
        return $next($request);
    }
}
