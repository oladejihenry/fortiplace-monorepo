<?php

namespace App\Console\Commands;

use Carbon\Carbon;

class ProcessWeeklyPayouts extends BasePayoutCommand
{
    protected $signature = 'payouts:process-weekly {--force : Force processing regardless of date}';
    protected $description = 'Process weekly payouts for sellers';

    public function handle(): int
    {
        if (!$this->isProcessingDay() && !$this->option('force')) {
            $this->info('Today is not the designated weekly payout day. Use --force to process anyway.');
            return 1;
        }

        $this->info('Processing weekly payouts...');
        $results = $this->payoutService->processPayouts('weekly');
        $this->displayResults($results);
        return 0;
    }

    private function isProcessingDay(): bool
    {
        return Carbon::now()->dayOfWeek === Carbon::MONDAY;
    }
}
