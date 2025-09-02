<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $firstItem = $this->items->first();

        $storeUrl = null;
        //store url should be http://subdomain.(app url)
        if ($firstItem && $firstItem->product && $firstItem->product->user && $firstItem->product->user->store) {
            $storeUrl = 'https://' . $firstItem->product->user->store->subdomain . '.' . env('FRONTEND_DOMAIN');
        }

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'customer_details' => [
                'name' => $this->metadata['customer_details']['firstName'] . ' ' . $this->metadata['customer_details']['lastName'],
                'email' => $this->customer_email,
                'phone' => $this->metadata['customer_details']['phone'] ?? null,
                'country' => $this->metadata['customer_details']['country'] ?? null,
            ],
            'order_details' => [
                'status' => $this->payment_status,
                'payment_method' => $this->payment_gateway,
                'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            ],
            'financial_details' => [
                'subtotal' => $this->amount,
                'original_currency' => $this->currency,
                'amount_ngn' => $this->amount_ngn,
                'commission_amount' => $this->commission_amount,
                'seller_amount' => $this->seller_amount,
            ],
            'items' => OrderItemResource::collection($this->items),
            'store_url' => $storeUrl,
            'download_count' => $this->download_count,
            'expires_at' => $this->expires_at?->format('Y-m-d H:i:s'),
        ];
    }
}
