<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;


class Coupon extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['code', 'type', 'amount', 'expires_at', 'status', 'creator_id'];

    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    protected $appends = [
        // 'is_valid',
        'formatted_amount',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function getIsValidAttribute(): bool
    {
        $now = Carbon::now();

        return $this->status === 'active' &&
            $this->expires_at > $now;
    }

    public function getFormattedAmountAttribute(): string
    {
        if ($this->type === 'percentage') {
            return $this->amount . '%';
        }

        return '₦' . number_format($this->amount, 2);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('expires_at', '>', Carbon::now());
    }

    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', Carbon::now())
            ->orWhere('status', 'expired');
    }

    public function calculateDiscount(float $orderTotal): array
    {
        $discountAmount = 0;

        if ($this->type === 'percentage') {
            $discountAmount = ($orderTotal * $this->amount) / 100;
        } else {
            // Fixed amount - can't exceed order total
            $discountAmount = min($this->amount, $orderTotal);
        }

        $finalAmount = max(0, $orderTotal - $discountAmount);

        return [
            'original_amount' => $orderTotal,
            'discount_amount' => $discountAmount,
            'final_amount' => $finalAmount,
            'coupon_type' => $this->type,
            'coupon_value' => $this->amount,
            'coupon_code' => $this->code,
        ];
    }

    public function canBeApplied(float $orderTotal): bool
    {
        return $this->is_valid && $orderTotal > 0;
    }
}
