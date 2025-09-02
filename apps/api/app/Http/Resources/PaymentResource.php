<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'order_id' => $this->order_id,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'payment_status' => $this->payment_status,
            'payment_reference' => $this->payment_reference,
            'customer_email' => $this->customer_email,
            'payment_gateway' => $this->payment_gateway,
            'provider_reference' => $this->provider_reference,
            'commission_amount' => $this->commission_amount,
            'seller_amount' => $this->seller_amount,
            'amount_ngn' => $this->amount_ngn,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
