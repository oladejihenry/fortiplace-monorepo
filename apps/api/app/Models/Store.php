<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Services\SubdomainService;

class Store extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'subdomain',
        'description',
        'store_logo',
        'support_email',
        'support_phone',
        'user_id',
        'is_active',
        'custom_domain',
        'custom_domain_status',
        'custom_domain_verification_token',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($store) {
            if (!$store->subdomain) {
                $subdomainService = app(SubdomainService::class);
                $store->subdomain = $subdomainService->generateSubdomain($store->name);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function integration(): HasOne
    {
        return $this->hasOne(Integration::class);
    }

    public function getUrl(): string
    {
        return sprintf('https://%s.%s', $this->subdomain, config('app.domain'));
    }

    public function getRouteKeyName()
    {
        return 'custom_domain';
    }

    public function resolveRouteBinding($value, $field = null)
    {
        $value = urldecode($value);

        // First try to find by custom domain
        $store = $this->where('custom_domain', $value)
            ->where('custom_domain_status', 'verified')
            ->first();

        if ($store) {
            return $store;
        }

        // If not found by custom domain, try to extract subdomain
        $subdomain = $this->extractSubdomain($value);

        if ($subdomain) {
            return $this->where('subdomain', $subdomain)
                ->where('is_active', true)
                ->first();
        }

        return null;
    }

    private function extractSubdomain(string $domain): ?string
    {
        // If it's just a single word (no dots), treat as subdomain directly
        if (!str_contains($domain, '.')) {
            return $domain;
        }

        // Handle localhost case
        if (str_contains($domain, 'localhost')) {
            $parts = explode('.', $domain);
            return $parts[0] ?? null;
        }

        // Handle production domain case
        $rootDomain = env('FRONTEND_DOMAIN');
        if (str_ends_with($domain, $rootDomain)) {
            return str_replace('.' . $rootDomain, '', $domain);
        }

        return null;
    }
}
