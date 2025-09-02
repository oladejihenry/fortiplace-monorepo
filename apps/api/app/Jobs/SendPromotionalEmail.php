<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Promotion;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\PromotionalEmail;

class SendPromotionalEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private Promotion $promotion,
        private User $user
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Mail::to($this->user)->send(new PromotionalEmail(
                $this->promotion,
                $this->user
            ));
        } catch (\Exception $e) {
            Log::error('Failed to send promotional email', [
                'promotion_id' => $this->promotion->id,
                'user_id' => $this->user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
