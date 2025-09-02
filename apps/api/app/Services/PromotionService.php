<?php

namespace App\Services;

use App\Jobs\SendPromotionalEmail;
use App\Models\Promotion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PromotionService
{
    public function schedulePromotion(Promotion $promotion): void
    {
        if (!$promotion->canBeSent()) {
            Log::info('Promotion has reached maximum send limit', [
                'promotion_id' => $promotion->id
            ]);
            return;
        }

        $users = $this->getTargetUsers($promotion);

        Log::info('Sending promotion to ' . $users->count() . ' users');

        foreach ($users->lazy() as $user) {
            SendPromotionalEmail::dispatch($promotion, $user)
                ->delay($promotion->next_send_at);
        }

        $promotion->update([
            'status' => 'scheduled',
            'send_count' => $promotion->send_count + 1,
            'last_sent_at' => $promotion->next_send_at,
        ]);
    }

    private function getTargetUsers(Promotion $promotion)
    {
        $query = User::query()
            ->where('is_banned', false);

        if (!$promotion->send_to_unverified_users) {
            $query->whereNotNull('email_verified_at');
        }

        // if ($promotion->target_audience) {
        //     // Apply filters based on target_audience configuration
        //     if (!empty($promotion->target_audience['user_type'])) {
        //         $query->where('user_type', $promotion->target_audience['user_type']);
        //     }

        //     if (!empty($promotion->target_audience['country'])) {
        //         $query->where('country', $promotion->target_audience['country']);
        //     }

        //     // Add more filters as needed
        // }

        return $query;
    }

    public function calculateInitialSendDate(array $scheduleConfig): ?Carbon
    {
        if (!$scheduleConfig) {
            return null;
        }

        return match ($scheduleConfig['frequency']) {
            'daily' => now()->addDay(),
            'weekly' => now()->addWeek(),
            'monthly' => now()->addMonth(),
            'custom' => isset($scheduleConfig['custom_date'])
                ? Carbon::parse($scheduleConfig['custom_date'])
                : now(),
            default => now()
        };
    }

    public function calculateNextSendDate(Promotion $promotion): ?Carbon
    {
        if (!$promotion->schedule_config) {
            return null;
        }

        $config = $promotion->schedule_config;
        $lastSent = $promotion->last_sent_at ?? now();

        return match ($config['frequency']) {
            'daily' => $lastSent->addDay(),
            'weekly' => $lastSent->addWeek(),
            'monthly' => $lastSent->addMonth(),
            'custom' => Carbon::parse($config['custom_date']),
            default => null
        };
    }
}
