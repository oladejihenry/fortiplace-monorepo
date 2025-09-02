<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StoreViewStat extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'period_type',
        'period_date',
        'views',
        'unique_views',
    ];

    protected $casts = [
        'period_date' => 'date',
        'views' => 'integer',
        'unique_views' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
