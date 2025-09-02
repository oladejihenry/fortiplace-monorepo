<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\ExchangeRateService;

class StoreProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $exchangeService = app(ExchangeRateService::class);

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'description' => $this->description,
            'content' => $this->content,
            'product_type' => $this->product_type,
            'cover_image' => $this->cover_image,
            'prices' => $exchangeService->calculatePrices($this->price),
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
                    'name' => $this->activeFile->original_name,
                    'size' => $this->activeFile->file_size,
                    'type' => $this->activeFile->mime_type,
                    'version' => $this->activeFile->version,
                ];
            }),
            'ratings' => $this->ratings,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
