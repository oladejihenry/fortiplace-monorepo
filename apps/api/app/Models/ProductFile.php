<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProductFile extends Model
{
    use HasUuids;

    protected $fillable = [
        'product_id',
        'file_name',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
        'file_hash',
        'version',
        'metadata',
        'storage_disk',
        'storage_path',
        'is_active',
        'module_order',
        'module_title',
        'module_description',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'version' => 'integer',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'module_order' => 'integer',
    ];

    protected $hidden = [
        'file_path',
        'storage_path',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getDownloadUrl(int $expiresInMinutes = 10080): string // 7 days default
    {
        return Storage::disk($this->storage_disk)
            ->temporaryUrl($this->storage_path, now()->addMinutes($expiresInMinutes));
    }

    public function getDownloadUrlWithToken($order): string
    {
        $expiresAt = now()->addYears(10)->timestamp;
        $token = encrypt([
            'order_id' => $order->id,
            'email' => $order->customer_email,
            'expires_at' => $expiresAt
        ]);

        return route('downloads.file', [
            'order_id' => $order->id,
            'product_id' => $this->product->id,
            'token' => $token
        ]);
    }

    public function getFileExtension(): string
    {
        return pathinfo($this->file_name, PATHINFO_EXTENSION);
    }

    public function delete(): bool
    {
        // Delete the actual file
        if (Storage::disk($this->storage_disk)->exists($this->storage_path)) {
            Storage::disk($this->storage_disk)->delete($this->storage_path);
        }

        return parent::delete();
    }


    public function getModuleInfo(): ?array
    {
        if (!$this->module_title) {
            return null;
        }

        return [
            'title' => $this->module_title,
            'description' => $this->module_description,
            'order' => $this->module_order,
        ];
    }
}
