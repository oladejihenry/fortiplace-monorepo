<?php

namespace App\Console\Commands;

use Carbon\Carbon;

class ProcessMonthlyPayouts extends BasePayoutCommand
{
    protected $signature = 'payouts:process-monthly {--force : Force processing regardless of date}';
    protected $description = 'Process monthly payouts for sellers on the last Friday of the month';

    public function handle(): int
    {
        if (!$this->isLastFridayOfMonth() && !$this->option('force')) {
            $this->info('Today is not the last Friday of the month. Use --force to process anyway.');
            return 1;
        }

        $this->info('Processing monthly payouts...');
        $results = $this->payoutService->processPayouts('monthly');
        $this->displayResults($results);
        return 0;
    }

    private function isLastFridayOfMonth(): bool
    {
        $today = Carbon::now();
        if ($today->dayOfWeek !== Carbon::FRIDAY) {
            return false;
        }

        $lastDayOfMonth = $today->copy()->endOfMonth();
        $lastFriday = $lastDayOfMonth->copy();
        while ($lastFriday->dayOfWeek !== Carbon::FRIDAY) {
            $lastFriday->subDay();
        }

        return $today->isSameDay($lastFriday);
    }
}
