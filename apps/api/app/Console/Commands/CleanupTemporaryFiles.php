<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ProductFileService;

class CleanupTemporaryFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:cleanup-temp-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up expired temporary product files';

    /**
     * Execute the console command.
     */
    public function handle(ProductFileService $productFileService)
    {
        $this->info('Cleaning up expired temporary product files...');
        $productFileService->cleanupTemporaryFiles();
        $this->info('Expired temporary product files cleaned up successfully.');
    }
}
