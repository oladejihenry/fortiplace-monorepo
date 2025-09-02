<?php

namespace App\Services;

use App\Helpers\FileHash;
use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ProductFileService
{
    public function storeFile(Product $product, UploadedFile $file): ProductFile
    {
        $hash = FileHash::hash($file->path());

        // Check if there's a temporary file with this hash
        $tempFile = ProductFile::where('file_hash', $hash)
            ->where('is_active', false)
            ->where('product_id', null)
            ->first();

        if ($tempFile) {
            // If temporary file exists, convert it to permanent
            return $this->convertTemporaryToPermanent($tempFile, $product);
        }

        // If no temporary file, create new permanent file
        $extension = $file->getClientOriginalExtension();
        $storagePath = "products/{$product->id}/files/{$hash}.{$extension}";

        //Store the file
        Storage::disk('spaces')->putFileAs(
            dirname($storagePath),
            $file,
            basename($storagePath)
        );

        //deactivate previous files
        $product->productFiles()->update(['is_active' => false]);

        ///create new product file record
        return $product->productFiles()->create([
            'file_name' => $file->getClientOriginalName(),
            'original_name' => $file->getClientOriginalName(),
            'storage_disk' => 'spaces',
            'storage_path' => $storagePath,
            'file_hash' => $hash,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'version' => $product->version,
            'is_active' => true,
            'metadata' => [
                'uploaded_at' => now(),
                'content_type' => $file->getMimeType(),
            ]
        ]);
    }

    public function storeTemporaryFile(
        UploadedFile $file,
        string $fileHash,
        array $metadata = []
    ): ProductFile {
        // Check if there's already a temporary file with this hash
        $existingTemp = ProductFile::where('file_hash', $fileHash)
            ->where('is_active', false)
            ->where('product_id', null)
            ->first();

        if ($existingTemp) {
            return $existingTemp;
        }

        $extension = $file->getClientOriginalExtension();
        $filename = Str::random(40) . '.' . $extension;
        $storagePath = "temp-products/" . $filename;

        // Store the file
        Storage::disk('spaces')->putFileAs(
            dirname($storagePath),
            $file,
            basename($storagePath),
            ['visibility' => 'private']
        );

        // Create temporary product file record
        return ProductFile::create([
            'file_name' => $filename,
            'original_name' => $metadata['original_name'] ?? $filename,
            'storage_disk' => 'spaces',
            'storage_path' => $storagePath,
            'file_size' => $metadata['file_size'] ?? $file->getSize(),
            'mime_type' => $metadata['mime_type'] ?? $file->getMimeType(),
            'file_hash' => $fileHash,
            'is_active' => false, // Temporary file
            'metadata' => array_merge($metadata, [
                'temporary' => true,
                'uploaded_at' => now(),
                'expires_at' => now()->addHours(24),
            ])
        ]);
    }

    public function convertTemporaryToPermanent(
        ProductFile $tempFile,
        Product $product
    ): ProductFile {
        // Deactivate any existing active files for this product
        $product->productFiles()->update(['is_active' => false]);

        $permanentPath = "products/{$product->id}/files/" . basename($tempFile->storage_path);

        // Move the file to permanent location
        Storage::disk($tempFile->storage_disk)->move(
            $tempFile->storage_path,
            $permanentPath
        );

        // Update file record
        $tempFile->update([
            'product_id' => $product->id,
            'storage_path' => $permanentPath,
            'is_active' => true,
            'version' => $product->version,
            'metadata' => array_merge($tempFile->metadata ?? [], [
                'temporary' => false,
                'converted_at' => now(),
            ])
        ]);

        return $tempFile->fresh();
    }

    public function findTemporaryFileByHash(string $fileHash): ?ProductFile
    {
        return ProductFile::where('file_hash', $fileHash)
            ->where('is_active', false)
            ->where('product_id', null)
            ->first();
    }

    public function generateDownloadUrl(ProductFile $file, int $expiresInMinutes = 10080): string
    {
        return $file->getDownloadUrl($expiresInMinutes);
    }

    public function deleteFile(ProductFile $file): bool
    {
        // Delete the actual file first
        if (Storage::disk($file->storage_disk)->exists($file->storage_path)) {
            Storage::disk($file->storage_disk)->delete($file->storage_path);
        }

        return $file->delete();
    }

    public function cleanupTemporaryFiles(): void
    {
        $expiredFiles = ProductFile::query()
            ->whereNull('product_id')
            ->where('is_active', false)
            ->where('created_at', '<', now()->subHours(24))
            ->get();

        foreach ($expiredFiles as $file) {
            $this->deleteFile($file);
        }
    }
}
