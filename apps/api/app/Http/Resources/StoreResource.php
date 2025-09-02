<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreResource extends JsonResource
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
            'subdomain' => $this->subdomain,
            'store_name' => $this->name,
            'description' => $this->description,
            'store_logo' => $this->store_logo,
            'support_email' => $this->support_email,
            'support_phone' => $this->support_phone,
            'is_active' => $this->is_active,
            'user_id' => $this->user_id,
            'integration' => $this->integration,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
