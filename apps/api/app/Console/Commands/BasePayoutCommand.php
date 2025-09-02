<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PayoutService;

abstract class BasePayoutCommand extends Command
{
    protected PayoutService $payoutService;

    public function __construct(PayoutService $payoutService)
    {
        parent::__construct();
        $this->payoutService = $payoutService;
    }

    protected function displayResults(array $results): void
    {
        $this->info('Payout jobs have been queued!');
        $this->table(
            ['Metric', 'Value'],
            [
                ['Total Users', $results['total_users']],
                ['Eligible Users', $results['eligible_users']],
                ['Queued for Processing', $results['queued_for_processing']],
            ]
        );
        $this->info('Jobs will process in the background. Check the queue worker logs for details.');
    }
}
