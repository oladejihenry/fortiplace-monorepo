<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomDomainResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //get full subdomain url
        $subdomainUrl = '';
        if (app()->environment('production')) {
            $subdomainUrl = 'https://' . $this->subdomain . '.' . env('FRONTEND_DOMAIN');
        } else {
            $subdomainUrl = 'http://' . $this->subdomain . '.' . env('FRONTEND_DOMAIN');
        }
        return [
            'id' => $this->id,
            'name' => $this->name,
            'subdomain' => $this->subdomain,
            'subdomain_url' => $subdomainUrl,
            'custom_domain' => $this->custom_domain,
            'custom_domain_status' => $this->custom_domain_status,
        ];
    }
}
