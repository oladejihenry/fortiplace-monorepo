<?php

namespace App\Services;

use App\Models\User;
use App\Models\Product;
use App\Notifications\UserBanned;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductPurchaseValidationService
{
    private const CACHE_PREFIX = 'self_purchase_attempt:';
    private const CACHE_TTL = 86400; // 24 hours
    private const WARNING_ATTEMPTS = [
        1 => 'Warning: You cannot purchase your own products. This is your first warning.',
        2 => 'Final Warning: Attempting to purchase your own products is not allowed and may result in account suspension.',
        3 => 'Your account has been suspended due to multiple attempts to purchase your own products.'
    ];

    public function validatePurchase(array $items, ?string $email): array
    {
        if (config('app.env') === 'local') {
            return [
                'valid' => true,
                'message' => null
            ];
        }

        if (!$email) {
            return [
                'valid' => true,
                'message' => null
            ];
        }

        foreach ($items as $item) {
            $product = Product::where('product_id', $item['product_id'])
                ->with('user')
                ->first();

            if ($product && $product->user->email === $email) {
                return $this->handleSelfPurchaseAttempt($product->user, $product);
            }
        }

        return [
            'valid' => true,
            'message' => null
        ];
    }

    private function handleSelfPurchaseAttempt(User $user, Product $product): array
    {

        $cacheKey = self::CACHE_PREFIX . $user->id;
        $attempts = Cache::get($cacheKey, 0) + 1;
        Cache::put($cacheKey, $attempts, self::CACHE_TTL);

        Log::warning('Self-purchase attempt detected', [
            'user_id' => $user->id,
            'product_id' => $product->product_id,
            'attempt_number' => $attempts
        ]);

        if ($attempts >= 3) {
            $this->banUser($user);
        }

        return [
            'valid' => false,
            'message' => self::WARNING_ATTEMPTS[$attempts] ?? self::WARNING_ATTEMPTS[3],
            'attempt' => $attempts
        ];
    }

    private function banUser(User $user): void
    {
        try {
            $banReason = 'Multiple attempts to purchase own products - Potential money laundering activity';

            // Get the first admin user as the banner
            $adminUser = User::role('admin')->firstOrFail();

            $user->ban($banReason, $adminUser);
            $user->notify(new UserBanned($banReason));

            Log::alert('User banned for self-purchase attempts', [
                'user_id' => $user->id,
                'email' => $user->email,
                'reason' => $banReason
            ]);

            // Clear the attempt counter
            Cache::forget(self::CACHE_PREFIX . $user->id);
        } catch (\Exception $e) {
            Log::error('Error banning user for self-purchase', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            throw $e; // Re-throw to handle in controller
        }
    }
}
