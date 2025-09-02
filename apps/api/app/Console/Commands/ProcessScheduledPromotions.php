<?php

namespace App\Console\Commands;

use App\Models\Promotion;
use App\Services\PromotionService;
use Illuminate\Console\Command;

class ProcessScheduledPromotions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'promotions:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process scheduled promotional emails';

    /**
     * Execute the console command.
     */
    public function handle(PromotionService $promotionService)
    {

        $promotions = Promotion::query()
            ->where('status', 'scheduled')
            ->where('next_send_at', '<=', now())
            ->whereRaw('send_count < max_sends')
            ->get();

        foreach ($promotions as $promotion) {
            $promotionService->schedulePromotion($promotion);

            // Calculate and set next send date
            $nextSendDate = $promotionService->calculateNextSendDate($promotion);

            if ($nextSendDate) {
                $promotion->update([
                    'next_send_at' => $nextSendDate
                ]);
            } else {
                $promotion->update(['status' => 'completed']);
            }
        }

        $this->info("Processed {$promotions->count()} promotions");
    }
}
