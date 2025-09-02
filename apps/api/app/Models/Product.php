<?php

namespace App\Models;

use App\Enums\ProductType;
use App\Enums\Currency;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'name',
        'description',
        'product_type',
        'cover_image',
        'price',
        'product_url',
        'preview_images',
        'is_published',
        'version',
        'metadata',
        'content',
        'file_hash',
        'add_customer_email_to_pdf_footer',
        'view_product_online',
        'slashed_price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'slashed_price' => 'decimal:2',
        'is_published' => 'boolean',
        'preview_images' => 'array',
        'metadata' => 'array',
        'product_type' => ProductType::class,
        'add_customer_email_to_pdf_footer' => 'boolean',
        'view_product_online' => 'boolean',
    ];

    protected $hidden = [
        'product_file',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Product $product) {
            $product->product_url = Str::slug($product->name) . '-' . Str::random(8);
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function productFiles(): HasMany
    {
        return $this->hasMany(ProductFile::class);
    }

    public function activeFile()
    {
        return $this->hasOne(ProductFile::class)
            ->where('is_active', true)
            ->latest();
    }

    public function latestFile()
    {
        return $this->hasOne(ProductFile::class)
            ->latest('version');
    }

    public function latestProductFile(): HasOne
    {
        return $this->hasOne(ProductFile::class)->latestOfMany('version');
    }

    public function getRouteKeyName(): string
    {
        return 'product_id';
    }

    public function incrementVersion(): void
    {
        $this->version++;
        $this->save();

        //if there's an associated file, increment the version
        if ($latestFile = $this->latestProductFile) {
            $newFile = $latestFile->replicate();
            $newFile->version = $this->version;
            $newFile->save();
        }
    }

    public function getDownloadUrl(): string
    {
        $latestFile = $this->latestProductFile;
        return $latestFile ? $latestFile->getDownloadUrl() : '';
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeByCreator($query, $user)
    {
        return $query->where('user_id', $user->id)
            ->orderBy('created_at', 'desc');  // Removed the index() call
    }
}
