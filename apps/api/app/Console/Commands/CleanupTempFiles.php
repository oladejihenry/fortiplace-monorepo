<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class CleanupTempFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:cleanup-temp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup temporary files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tempPath = storage_path('app/temp');
        if (File::exists($tempPath)) {
            $files = File::allFiles($tempPath);

            $count = 0;
            foreach ($files as $file) {
                if (time() - File::lastModified($file) > 24 * 60 * 60) {
                    File::delete($file);
                    $count++;
                }
            }

            $this->info("Deleted $count files from $tempPath");
        }

        return 0;
    }
}
