<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class OrderItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'product_id',
        'seller_id',
        'quantity',
        'unit_price',
        'total_price',
        'unit_price_ngn',
        'total_price_ngn',
        'commission_amount',
        'seller_amount',
        'currency',
        'status',
        'download_count'
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'unit_price_ngn' => 'decimal:2',
        'total_price_ngn' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'seller_amount' => 'decimal:2',
        'quantity' => 'integer',
        'download_count' => 'integer'
    ];

    //Status constants for download tracking
    const STATUS_NOT_DOWNLOADED = 'not_downloaded';
    const STATUS_DOWNLOADED = 'downloaded';

    public function markAsDownloaded()
    {
        $this->increment('download_count');
        if ($this->status === self::STATUS_NOT_DOWNLOADED) {
            $this->update(['status' => self::STATUS_DOWNLOADED]);
        }
    }


    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function payouts()
    {
        return $this->belongsToMany(
            Payout::class,
            'order_item_payout',
        );
    }
}
