<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CouponService
{
    public function createCoupon(array $data, User $creator): Coupon
    {

        $data['code'] = strtoupper($data['code']);
        $data['type'] = $data['type'];
        $data['creator_id'] = $creator->id;
        $data['amount'] = $data['amount'];
        $data['expires_at'] = $data['expires_at'];
        $data['status'] = 'active';

        $coupon = Coupon::create($data);

        return $coupon;
    }

    public function updateCoupon(Coupon $coupon, array $data): Coupon
    {
        $coupon->update($data);
        return $coupon;
    }


    public function getCouponsByCreator(User $creator): Collection
    {
        return Coupon::where('creator_id', $creator->id)->orderBy('created_at', 'desc')->get();
    }

    public function validateCouponCode(string $couponCode, string $userId, float $orderTotal): ?Coupon
    {

        $coupon = Coupon::where('code', strtoupper($couponCode))->where('creator_id', $userId)
            ->where('status', 'active')
            ->where('expires_at', '>', Carbon::now())
            ->first();


        if (!$coupon) {
            return null;
        }

        return $coupon;
    }
}
