<?php

namespace App\Console\Commands;

class ProcessDailyPayouts extends BasePayoutCommand
{
    protected $signature = 'payouts:process-daily {--force : Force processing regardless of date}';
    protected $description = 'Process daily payouts for sellers';

    public function handle(): int
    {
        $this->info('Processing daily payouts...');
        $results = $this->payoutService->processPayouts('daily');
        $this->displayResults($results);
        return 0;
    }
}
