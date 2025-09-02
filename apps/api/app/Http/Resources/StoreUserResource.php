<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreUserResource extends JsonResource
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
            'username' => $this->username,
            'store_name' => $this->store->name,
            'email' => $this->email,
            'description' => $this->description,
            'phone_number' => $this->phone_number,
            'store_phone_number' => $this->store->support_phone,
            'store_email' => $this->store->support_email,
            'google_avatar' => $this->google_avatar,
            'twitter_avatar' => $this->twitter_avatar,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
