<?php

namespace App\Console\Commands;

use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpireCoupons extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coupons:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expire coupons that are past their expiry date';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting coupon expiration process...');

        try {
            $expiredCoupons = Coupon::where('status', 'active')
                ->where('expires_at', '<', Carbon::now())
                ->get();

            $count = 0;
            foreach ($expiredCoupons as $coupon) {
                $coupon->update(['status' => 'expired']);
                $count++;

                Log::info("Coupon {$coupon->code} expired automatically", [
                    'coupon_id' => $coupon->id,
                    'expired_at' => $coupon->expires_at,
                    'status_changed_at' => now()
                ]);
            }

            $this->info("Successfully expired {$count} coupons");

            if ($count > 0) {
                Log::info("Coupon expiration job completed", ['expired_count' => $count]);
            }
        } catch (\Exception $e) {
            Log::error("Error expiring coupons: " . $e->getMessage());
            $this->error("Error expiring coupons: " . $e->getMessage());
        }
    }
}
