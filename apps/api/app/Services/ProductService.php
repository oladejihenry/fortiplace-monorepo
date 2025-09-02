<?php

namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Hidehalo\Nanoid\Client;
use Illuminate\Support\Str;
use Mews\Purifier\Facades\Purifier;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductService
{
    private Client $nanoid;
    private const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

    public function __construct()
    {
        $this->nanoid = new Client();
    }

    /**
     * Create a draft product
     * @param User $creator
     * @param array $data
     * @return Product
     */
    public function createDraftProduct(User $creator, array $data): Product
    {
        $productId = $this->generateProductId();

        //Ensure unique product id
        while (Product::where('product_id', strtolower($productId))->exists()) {
            $productId = $this->generateProductId();
        }

        // Validate minimum price
        if ($data['price'] < 1000) {
            throw new \InvalidArgumentException('Product price must be at least ₦1,000');
        }

        return $creator->products()->create([
            'product_id' => strtolower($productId),
            'name' => $data['name'],
            'product_type' => $data['product_type'],
            'metadata' => $data['metadata'] ?? null,
            'price' => $data['price'],
            'is_published' => false,
            'product_url' => $productId,
        ]);
    }

    /**
     * Finish a draft product
     * @param Product $product
     * @return void
     */
    public function finishDraftProduct(Product $product): void
    {
        $product->product_url = $this->generateProductUrl($product->name);
        $product->save();
    }

    /**
     * Get a draft product
     * @param string $productId
     * @return Product
     */
    public function getDraftProduct(string $productId): Product
    {
        return Product::where('product_id', strtolower($productId))->first();
    }

    /**
     * Update a draft product
     * @param string $productId
     * @param array $data
     * @return Product
     */
    public function updateDraftProduct(string $productId, array $data): Product
    {
        $product = $this->getDraftProduct($productId);

        if (isset($data['price']) && $data['price'] < 1000) {
            throw new \InvalidArgumentException('Product price must be at least ₦1,000');
        }

        if (isset($data['content'])) {
            $purifiedContent = Purifier::clean($data['content']);
            $data['content'] = $purifiedContent;
        }
        $product->update($data);
        return $product;
    }


    /**
     * Publish a product
     * @param Product $product
     * @return void
     */
    public function publishProduct(Product $product): void
    {
        $product->is_published = true;
        $product->save();
    }

    /**
     * Delete a product
     * @param Product $product
     * @return void
     */
    public function deleteProduct(Product $product): void
    {
        try {
            //Delete product file
            if ($product->product_file) {
                $this->deleteFile($product->product_file);
            }

            //Delete cover image
            if ($product->cover_image) {
                $this->deleteFile($product->cover_image);
            }

            $product->delete();
        } catch (\Exception $e) {
            Log::error('Error deleting product: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a file from storage
     * @param string|null $url
     * @return bool
     */
    private function deleteFile(?string $url): bool
    {
        if (!$url) return false;

        try {
            $path = str_replace(['http://localhost:8000/storage/', 'storage/'], '', $url);
            return Storage::disk('public')->delete($path);
        } catch (\Exception $e) {
            Log::error('Error deleting file: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Generate a unique product url
     * @param string $name
     * @return string
     */
    private function generateProductUrl(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (Product::where('product_url', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Generate a unique product id
     * @return string
     */
    private function generateProductId(): string
    {
        return $this->nanoid->formattedId(self::ALPHABET, 5);
    }
}
