<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Rating extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'user_id',
        'rating',
        'session_id',
        'ip_address'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function canUserRate($productId, $userId = null, $sessionId = null): bool
    {
        $query = self::where('product_id', $productId);

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return !$query->exists();
    }
}
