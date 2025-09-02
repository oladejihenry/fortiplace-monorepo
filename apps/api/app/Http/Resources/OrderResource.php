<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'user_id' => $this->user_id,
            'amount' => $this->amount,
            'amount_ngn' => $this->amount_ngn,
            'commission_amount' => $this->commission_amount,
            'seller_amount' => $this->seller_amount,
            'currency' => $this->currency,
            'payment_status' => $this->payment_status,
            'payment_gateway' => $this->payment_gateway,
            'payment_reference' => $this->payment_reference,
            'provider_reference' => $this->provider_reference,

            // Customer details from metadata
            'customer_details' => $this->metadata['customer_details'] ?? null,

            // Items collection
            'items' => $this->whenLoaded('items', function () use ($request) {
                return $this->items->map(function ($item) use ($request) {
                    $baseItemData = [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'unit_price_ngn' => $item->unit_price_ngn,
                        'total_price' => $item->total_price,
                        'total_price_ngn' => $item->total_price_ngn,
                        'commission_amount' => $item->commission_amount,
                        'seller_amount' => $item->seller_amount,
                        'currency' => $item->currency,
                        'status' => $item->status,
                        'download_count' => $item->download_count,
                    ];

                    if ($item->product) {
                        $baseItemData['product'] = [
                            'id' => $item->product->id,
                            'product_id' => $item->product->product_id,
                            'name' => $item->product->name,
                            'product_type' => $item->product->product_type->value,
                            'cover_image' => $item->product->cover_image,
                            'product_url' => $item->product->product_url,
                            'view_product_online' => $item->product->view_product_online,
                        ];

                        // Only include download URL if payment is successful and active file exists
                        if ($this->payment_status === 'success' && $item->product->activeFile) {
                            $baseItemData['product']['download_url'] = $item->product->activeFile->getDownloadUrlWithToken($this);
                            $baseItemData['product']['file_name'] = $item->product->activeFile->file_name;
                            $baseItemData['product']['file_size'] = $item->product->activeFile->file_size;
                            $baseItemData['product']['mime_type'] = $item->product->activeFile->mime_type;
                        }

                        // Add seller information if available
                        if ($item->product->user) {
                            $baseItemData['product']['seller'] = [
                                'username' => $item->product->user->username,
                                'email' => $item->product->user->email,
                            ];

                            // Add store information if available
                            if ($item->product->user->store) {
                                $baseItemData['product']['seller']['store'] = [
                                    'name' => $item->product->user->store->name,
                                    'subdomain' => $item->product->user->store->subdomain,
                                ];
                            }
                        }
                    }

                    return $baseItemData;
                });
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
