<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ProductRatingController extends Controller
{
    public function rate(Request $request, Product $product)
    {
        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
        ]);

        try {
            DB::beginTransaction();

            $user = $request->user();
            $sessionId = $user ? null : (session()->getId() ?: Str::random(40));

            Log::info($user);
            Log::info($sessionId);

            // Check if user or session has already rated
            if (!Rating::canUserRate($product->id, $user?->id, $sessionId)) {
                return response()->json([
                    'message' => 'You have already rated this product',
                ], 400);
            }

            $ipAddress = $request->ip();
            $recentRatings = Rating::where('ip_address', $ipAddress)
                ->where('created_at', '>', now()->subHour())
                ->count();

            if ($recentRatings >= 10) {
                return response()->json([
                    'message' => 'Too many ratings from this IP address. Please try again later.',
                ], 429);
            }

            // Update or create the rating
            $rating = Rating::create([
                'product_id' => $product->id,
                'user_id' => $user?->id,
                'session_id' => $sessionId,
                'ip_address' => $ipAddress,
                'rating' => $request->rating,
            ]);

            $stats = Rating::where('product_id', $product->id)
                ->select(
                    DB::raw('AVG(rating) as average'),
                    DB::raw('COUNT(*) as count')
                )
                ->first();

            if (!$user) {
                session()->put('rating_session_id', $sessionId);
            }

            DB::commit();

            return response()->json([
                'average' => round($stats->average, 1),
                'count' => $stats->count,
                'user_rating' => $rating->rating
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to rate product',
            ], 500);
        }
    }

    public function getUserRating(Request $request, Product $product)
    {
        $user = $request->user();
        $query = Rating::where('product_id', $product->id);

        if ($user) {
            $query->where('user_id', $user->id);
        } else {
            $sessionId = session()->get('rating_session_id');
            if (!$sessionId) {
                return response()->json(['rating' => null]);
            }
            $query->where('session_id', $sessionId);
        }

        $rating = $query->first();

        return response()->json([
            'rating' => $rating ? $rating->rating : null
        ]);
    }
}
