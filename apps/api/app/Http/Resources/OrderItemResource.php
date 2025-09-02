<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'product_id' => $this->product->product_id,
                'image' => $this->product->cover_image,
                // 'store' => [
                //     'subdomain' => $this->product->user->subdomain,
                //     'url' => $this->product->user->subdomain . '.' . config('app.url'),
                // ],
                // 'url' => route('store.products.show', [
                //     'store' => $this->product->user->subdomain,
                //     'product' => $this->product->product_id
                // ]),
            ],
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'total_price' => $this->total_price,
            'unit_price_ngn' => $this->unit_price_ngn,
            'total_price_ngn' => $this->total_price_ngn,
            'currency' => $this->currency,
            'commission_amount' => $this->commission_amount,
            'seller_amount' => $this->seller_amount,
            'status' => $this->status,
            'download_count' => $this->download_count,
        ];
    }
}
