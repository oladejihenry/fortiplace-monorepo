<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProductViewStat extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'product_id',
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
}
