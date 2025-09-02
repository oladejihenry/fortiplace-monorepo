<?php

namespace App\Console\Commands;

use App\Services\PayoutService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessMonthlyPayouts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payouts:process-monthly {--force : Force processing regardless of date}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Queue monthly payout jobs for sellers on the last Friday of the month';


    public function __construct(private PayoutService $payoutService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now();
        $isLastFriday = $this->isLastFridayOfMonth($today);

        if (!$isLastFriday && !$this->option('force')) {
            $this->info('Today is not the last Friday of the month. Use --force to process anyway.');
            return 1;
        }

        $this->info('Queueing monthly payout jobs...');

        $results = $this->payoutService->processMonthlyPayouts();

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

        return 0;
    }

    private function isLastFridayOfMonth(Carbon $date): bool
    {
        //check if today is Friday
        if ($date->dayOfWeek !== Carbon::FRIDAY) {
            return false;
        }

        $lastDayOfMonth = $date->copy()->endOfMonth();

        // Find the last Friday of the month
        $lastFriday = $lastDayOfMonth->copy();
        while ($lastFriday->dayOfWeek !== Carbon::FRIDAY) {
            $lastFriday->subDay();
        }

        // Check if today is the last Friday
        return $date->isSameDay($lastFriday);
    }
}
