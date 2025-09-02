<?php

namespace App\Services;

use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Jobs\ProcessUserPayout;
use Carbon\Carbon;

class PayoutService
{
    private float $minimumPayoutAmount;

    public function __construct(
        private FlutterwaveService $flutterwave,
    ) {
        $this->minimumPayoutAmount = (float) config('payouts.minimum_amount', 200);
    }

    public function processMonthlyPayouts(): array
    {
        $results = [
            'total_users' => 0,
            'eligible_users' => 0,
            'queued_for_processing' => 0,
        ];

        //get all users with  bank detatils who have earnings to be paid out
        $eligibleUsers = $this->getEligibleUsers();
        $results['total_users'] = count($eligibleUsers);

        $queuedCount = 0;

        foreach ($eligibleUsers as $user) {
            try {
                $amount = $this->calculatePendingEarnings($user);

                if ($amount < $this->minimumPayoutAmount) {
                    Log::info('User payout amount below minimum: ', [
                        'user_id' => $user->id,
                        'amount' => $amount,
                        'minimum' => $this->minimumPayoutAmount,
                    ]);
                    continue;
                }

                //Dispatch job to process payout
                ProcessUserPayout::dispatch($user);
                $queuedCount++;

                Log::info('Payout queued for user ' . $user->id, [
                    'user_id' => $user->id,
                    'amount' => $amount,
                ]);
            } catch (\Exception $e) {
                Log::error('Error processing payout for user ', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $results['eligible_users'] = count($eligibleUsers);
        $results['queued_for_processing'] = $queuedCount;

        return $results;
    }

    // public function calculatePendingEarnings(User $user): float
    // {
    //     $paidOrderItemIds = DB::table('order_item_payout')
    //         ->join('payouts', 'order_item_payout.payout_id', '=', 'payouts.id')
    //         ->where('payouts.status', 'completed')
    //         ->pluck('order_item_id')
    //         ->toArray();

    //     $totalEarnings = OrderItem::where('seller_id', $user->id)
    //         ->whereHas('order', function ($query) {
    //             $query->where('payment_status', 'success');
    //         })
    //         ->whereNotIn('id', $paidOrderItemIds)
    //         ->sum('seller_amount');

    //     return (float) $totalEarnings;
    // }



    // public function processPayout(Payout $payout): array
    // {
    //     try {

    //         //verify that these order items have not been paid out
    //         $orderItemIds = $payout->metadata['order_items'] ?? [];
    //         $alreadyPaidCount =  DB::table('order_item_payout')
    //             ->join('payouts', 'order_item_payout.payout_id', '=', 'payouts.id')
    //             ->whereIn('order_item_id', $orderItemIds)
    //             ->where('order_item_payout.payout_id', '!=', $payout->id)
    //             ->where('payouts.status', 'completed')  // Only consider completed payouts
    //             ->count();

    //         if ($alreadyPaidCount > 0) {
    //             $payout->markAsFailed('Some order items have already been paid out in another payout');
    //             return [
    //                 'success' => false,
    //                 'error' => 'Duplicate payment detected',
    //             ];
    //         }

    //         $payout->markAsProcessing();

    //         Log::info('Initiating payout for user ' . $payout);

    //         $transferResult = $this->flutterwave->initiateTransfer([
    //             'account_bank' => $payout->bank_code,
    //             'account_number' => $payout->bank_account_number,
    //             'amount' => $payout->amount,
    //             'narration' => 'FORTIPLACE PAYOUT - ' . $payout->reference,
    //             'currency' => $payout->currency,
    //             'reference' => $payout->reference,
    //             'debit_currency' => $payout->currency,
    //         ]);

    //         if ($transferResult['status']) {
    //             $payout->markAsCompleted($transferResult['transaction_id']);
    //             return [
    //                 'success' => true,
    //                 'transaction_id' => $transferResult['transaction_id']
    //             ];
    //         }
    //         // else {
    //         //     //retry with flutterwave
    //         //     $transferResult = $this->flutterwave->retryTransfer($transferResult['data']['id']);

    //         //     if ($transferResult['status'] === 'success') {
    //         //         $payout->markAsCompleted($transferResult['transaction_id']);
    //         //         return [
    //         //             'success' => true,
    //         //             'transaction_id' => $transferResult['transaction_id']
    //         //         ];
    //         //     }
    //         // }

    //         $payout->markAsFailed($transferResult['message'] ?? 'Unknown error');
    //         return [
    //             'success' => false,
    //             'error' => $transferResult['message'],
    //         ];
    //     } catch (\Exception $e) {
    //         $payout->markAsFailed($e->getMessage());
    //         return [
    //             'status' => false,
    //             'message' => $e->getMessage()
    //         ];
    //     }
    // }

    //start from here

    public function createPayout(User $user, float $amount): Payout
    {
        $dateRange = $this->getPayoutDateRange($user->payment_schedule);

        $paidOrderItemIds = DB::table('order_item_payout')
            ->join('payouts', 'order_item_payout.payout_id', '=', 'payouts.id')
            ->where('payouts.status', 'completed')
            ->pluck('order_item_id')
            ->toArray();

        $orderItems = OrderItem::where('seller_id', $user->id)
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'success');
            })
            ->whereNotIn('id', $paidOrderItemIds)
            ->get();

        $orderItemIds = $orderItems->pluck('id')->toArray();

        if (empty($orderItemIds)) {
            throw new \Exception('No order items to payout');
        }

        return DB::transaction(function () use ($user, $amount, $orderItemIds) {
            $payout = Payout::create([
                'user_id' => $user->id,
                'reference' => 'PAYOUT_' . Str::random(10),
                'amount' => $amount,
                'currency' => 'NGN',
                'bank_code' => $user->bank_code,
                'bank_account_number' => $user->bank_account_number,
                'status' => 'pending',
                'metadata' => [
                    'order_items' => $orderItemIds,
                ],

            ]);

            //attach using uuid
            foreach ($orderItemIds as $orderItemId) {
                DB::table('order_item_payout')->insert([
                    'id' => Str::uuid()->toString(),
                    'order_item_id' => $orderItemId,
                    'payout_id' => $payout->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }


            return $payout;
        });
    }

    public function processPayouts(string $schedule): array
    {
        $results = [
            'total_users' => 0,
            'eligible_users' => 0,
            'queued_for_processing' => 0,
        ];

        DB::beginTransaction();

        try {
            $eligibleUsers = $this->getEligibleUsers($schedule);
            $results['total_users'] = count($eligibleUsers);
            $queuedCount = 0;
            foreach ($eligibleUsers as $user) {
                try {
                    $amount = $this->calculatePendingEarnings($user);

                    if ($amount < $this->minimumPayoutAmount) {
                        Log::info('User payout amount below minimum', [
                            'user_id' => $user->id,
                            'amount' => $amount,
                            'minimum' => $this->minimumPayoutAmount,
                        ]);
                        continue;
                    }

                    ProcessUserPayout::dispatch($user)
                        ->onQueue('default')
                        ->delay($this->getProcessingDelay($queuedCount));

                    $queuedCount++;
                } catch (\Exception $e) {
                    Log::error('Error queueing payout for user', [
                        'user_id' => $user->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
            DB::commit();

            $results['eligible_users'] = count($eligibleUsers);
            $results['queued_for_processing'] = $queuedCount;

            return $results;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error processing payouts', [
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function calculatePendingEarnings(User $user)
    {
        $dateRange = $this->getPayoutDateRange($user->payment_schedule);

        $paidOrderItemIds = DB::table('order_item_payout')
            ->join('payouts', 'order_item_payout.payout_id', '=', 'payouts.id')
            ->where('payouts.status', 'completed')
            ->pluck('order_item_id')
            ->toArray();

        return (float) OrderItem::where('seller_id', $user->id)
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'success');
            })
            ->whereNotIn('id', $paidOrderItemIds)
            ->sum('seller_amount');
    }

    public function processPayout(Payout $payout): array
    {
        return DB::transaction(function () use ($payout) {
            // Verify no duplicate payments
            if ($this->hasBeenPaid($payout)) {
                throw new \Exception('Duplicate payment detected');
            }

            $transferResult = $this->flutterwave->initiateTransfer([
                'account_bank' => $payout->bank_code,
                'account_number' => $payout->bank_account_number,
                'amount' => $payout->amount,
                'narration' => 'PAYOUT - ' . $payout->reference,
                'currency' => $payout->currency,
                'reference' => $payout->reference,
                'debit_currency' => $payout->currency,
            ]);

            if ($transferResult['status']) {
                $payout->markAsCompleted($transferResult['transaction_id']);
                return [
                    'success' => true,
                    'transaction_id' => $transferResult['transaction_id']
                ];
            }

            $payout->markAsFailed($transferResult['message'] ?? 'Unknown error');
            return [
                'success' => false,
                'error' => $transferResult['message'],
            ];
        });
    }

    private function getEligibleUsers(?string $schedule = null): array
    {
        $query = User::whereNotNull('bank_code')
            ->whereNotNull('bank_account_number')
            ->where('is_banned', false)
            ->where('disable_payouts', false);

        if ($schedule) {
            $query->where('payment_schedule', $schedule);
        }

        return $query->get()
            ->filter(function ($user) {
                $pendingAmount = $this->calculatePendingEarnings($user);
                return $pendingAmount > 0;
            })
            ->all();
    }

    private function getPayoutDateRange(string $schedule): array
    {
        $now = Carbon::now();

        return match ($schedule) {
            'daily' => [
                'start' => $now->copy()->subDay()->startOfDay(),
                'end' => $now->copy()->subDay()->endOfDay(),
            ],
            'weekly' => [
                'start' => $now->copy()->subWeek()->startOfWeek(),
                'end' => $now->copy()->subWeek()->endOfWeek(),
            ],
            'monthly' => [
                'start' => $now->copy()->subMonth()->startOfMonth(),
                'end' => $now->copy()->subMonth()->endOfMonth(),
            ],
            default => throw new \InvalidArgumentException('Invalid payment schedule'),
        };
    }

    private function getProcessingDelay(int $index): int
    {
        // Add a small delay between each payout to prevent overwhelming Flutterwave
        return $index * 5; // 5 seconds between each payout
    }

    private function hasBeenPaid(Payout $payout): bool
    {
        $orderItemIds = $payout->metadata['order_items'] ?? [];
        return DB::table('order_item_payout')
            ->join('payouts', 'order_item_payout.payout_id', '=', 'payouts.id')
            ->whereIn('order_item_id', $orderItemIds)
            ->where('order_item_payout.payout_id', '!=', $payout->id)
            ->where('payouts.status', 'completed')
            ->exists();
    }

    // private function getEligibleUsers(): array
    // {
    //     return User::whereNotNull('bank_code')
    //         ->whereNotNull('bank_account_number')
    //         ->where('is_banned', false)
    //         ->get()
    //         ->filter(function ($user) {
    //             $pendingAmount = $this->calculatePendingEarnings($user);
    //             return $pendingAmount > 0;
    //         })
    //         ->all();
    // }
}
