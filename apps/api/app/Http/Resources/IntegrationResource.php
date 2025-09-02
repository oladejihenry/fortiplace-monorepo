<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IntegrationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'googleTag' => $this->googleTag,
            'facebookUsername' => $this->facebookUsername,
            'metaPixel' => $this->metaPixel,
            'twitterUsername' => $this->twitterUsername,
        ];
    }
}
