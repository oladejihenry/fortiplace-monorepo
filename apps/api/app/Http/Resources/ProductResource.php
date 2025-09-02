<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\FlutterwaveService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'description' => $this->description,
            'content' => $this->content,
            'product_type' => $this->product_type,
            'cover_image' => $this->cover_image,
            'price' => $this->price,
            'slashed_price' => $this->slashed_price,
            'product_url' => $this->product_url,
            'preview_images' => $this->preview_images,
            'is_published' => $this->is_published,
            'version' => $this->version,
            'creator' => new UserResource($this->whenLoaded('user')),
            'metadata' => $this->metadata,
            'product_file' => $this->when($this->activeFile, function () {
                return [
                    'name' => $this->activeFile->file_name,
                    'size' => $this->activeFile->file_size,
                    'type' => $this->activeFile->mime_type,
                    'url' => $this->activeFile->getDownloadUrl(),
                    'version' => $this->activeFile->version,
                    'file_hash' => $this->activeFile->file_hash,
                ];
            }),
            'add_customer_email_to_pdf_footer' => $this->add_customer_email_to_pdf_footer,
            'view_product_online' => $this->view_product_online,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    // private function getCachedPrices(): array
    // {
    //     $cacheKey = "product_static_prices:{$this->id}:{$this->price}";

    //     try {
    //         return Cache::store('redis')->remember($cacheKey, 3600, function () {
    //             $flutterwaveService = app(FlutterwaveService::class);
    //             return $flutterwaveService->calculatePrices($this->price);
    //         });
    //     } catch (\Exception $e) {
    //         Log::error('Redis caching failed, using fallback', ['error' => $e->getMessage()]);
    //         // Fallback to file cache or return base price only
    //         return [[
    //             'currency' => FlutterwaveService::BASE_CURRENCY,
    //             'price' => $this->price,
    //             'regularPrice' => null
    //         ]];
    //     }
    // }
}
