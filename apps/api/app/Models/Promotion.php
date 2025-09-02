<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Promotion extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $fillable = [
        'name',
        'subject',
        'content',
        'target_audience',
        'send_count',
        'max_sends',
        'last_sent_at',
        'next_send_at',
        'status',
        'schedule_config',
        'send_to_unverified_users'
    ];

    protected $casts = [
        'target_audience' => 'array',
        'schedule_config' => 'array',
        'last_sent_at' => 'datetime',
        'next_send_at' => 'datetime',
    ];

    public function canBeSent(): bool
    {
        return $this->send_count < $this->max_sends;
    }
}
