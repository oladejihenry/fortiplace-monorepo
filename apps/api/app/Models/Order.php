<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Notifications\Notifiable;

class Order extends Model
{
    use HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'order_id',
        'user_id',
        'amount',
        'currency',
        'payment_status',
        'payment_reference',
        'customer_email',
        'download_count',
        'expires_at',
        'payment_gateway',
        'provider_reference',
        'metadata',
        'commission_amount',
        'seller_amount',
        'email_sent',
        'amount_ngn',
        'reminder_sent_at',
        'reminder_count',
        'idempotency_key'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'amount_ngn' => 'decimal:2',
        'expires_at' => 'datetime',
        'metadata' => 'array',
        'download_count' => 'integer',
        'email_sent' => 'boolean',
        'reminder_sent_at' => 'datetime',
        'reminder_count' => 'integer',
        'idempotency_key' => 'string'
    ];

    // Add payment status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_SUCCESS = 'success';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_ABANDONED = 'abandoned';

    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_SUCCESS,
            self::STATUS_FAILED,
            self::STATUS_CANCELLED,
            self::STATUS_ABANDONED
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function routeNotificationForMail(): string
    {
        return $this->customer_email;
    }
}
