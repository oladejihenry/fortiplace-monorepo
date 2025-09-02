<?php

namespace App\Jobs;

use App\Models\User;
use App\Notifications\PayoutProcessed;
use App\Services\PayoutService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessUserPayout implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;


    public $tries = 3;


    public $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public User $user
    ) {}

    /**
     * Execute the job.
     */
    public function handle(PayoutService $payoutService): void
    {
        try {
            //calculate earnings for this user
            $amount = $payoutService->calculatePendingEarnings($this->user);

            //skip if below minimum amount
            if ($amount < (float) config('payouts.minimum_amount', 5000)) {
                Log::info('User payout amount below minimum: ', [
                    'user_id' => $this->user->id,
                    'amount' => $amount
                ]);
                return;
            }

            //create payout record
            $payout = $payoutService->createPayout($this->user, $amount);

            //process the transfer
            $transferResult = $payoutService->processPayout($payout);

            if ($transferResult['success']) {
                //send notification to user
                $this->user->notify(new PayoutProcessed($payout));

                Log::info('Payout processed successfully: ', [
                    'user_id' => $this->user->id,
                    'payout_id' => $payout->id,
                    'amount' => $amount
                ]);
            } else {
                Log::error('Payout failed: ', [
                    'user_id' => $this->user->id,
                    'payout_id' => $payout->id,
                    'error' => $transferResult['error'] ?? 'Unknown error'
                ]);

                //todo: send notification to user
            }
        } catch (\Exception $e) {
            Log::error('Error processing user payout: ', [
                'user_id' => $this->user->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
