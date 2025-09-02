<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Permission\Traits\HasRoles;
use App\Notifications\CustomEmailVerify;
use Illuminate\Database\Eloquent\SoftDeletes;
use Lab404\Impersonate\Models\Impersonate;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasUuids, HasRoles, Impersonate;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'bank_code',
        'bank_account_number',
        'phone_number',
        'description',
        'google_id',
        'google_avatar',
        'twitter_id',
        'twitter_avatar',
        'is_banned',
        'banned_at',
        'ban_reason',
        'banned_by',
        'bank_id',
        'bank_name',
        'bank_account_name',
        'email_verified_at',
        'payment_schedule',
        'disable_payouts',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_banned' => 'boolean',
            'banned_at' => 'datetime',
            'disable_payouts' => 'boolean',
        ];
    }

    protected static function boot()
    {
        parent::boot();
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function store(): HasOne
    {
        return $this->hasOne(Store::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }

    public function isBanned(): bool
    {
        return $this->is_banned;
    }

    public function ban(string $reason, User $admin)
    {
        $this->update([
            'is_banned' => true,
            'banned_at' => now(),
            'ban_reason' => $reason,
            'banned_by' => $admin->id,
        ]);
    }

    public function unban()
    {
        $this->update([
            'is_banned' => false,
            'banned_at' => null,
            'ban_reason' => null,
            'banned_by' => null,
        ]);
    }

    public function getStoreUrl(): ?string
    {
        if ($this->store) {
            return sprintf('https://%s.%s', $this->store->subdomain, config('app.domain'));
        }

        return null;
    }

    public function isCustomer(): bool
    {
        return $this->hasRole(UserRole::CUSTOMER->value);
    }

    public function isCreator(): bool
    {
        return $this->hasRole(UserRole::CREATOR->value);
    }

    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::ADMIN->value);
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new CustomEmailVerify);
    }

    public function integration(): HasOne
    {
        return $this->hasOne(Integration::class);
    }
}
