<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Integration extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'googleTag',
        'facebookUsername',
        'metaPixel',
        'twitterUsername',
        'user_id',
        'store_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
