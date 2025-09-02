<?php

namespace App\Jobs;

use App\Models\Store;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AddCustomDomainToVercel implements ShouldQueue
{
    use Queueable;

    public function __construct(public Store $store)
    {
        //
    }

    public function handle(): void
    {
        try {
            $store = $this->store;
            $domain = $store->custom_domain;

            //vercel token
            $vercelToken = config('services.vercel.token');

            // First, add the domain to Vercel
            $addDomainResponse = Http::withToken($vercelToken)
                ->post('https://api.vercel.com/v9/projects/' . config('services.vercel.project_id') . '/domains', [
                    'name' => $domain
                ]);

            Log::info('Add Domain Response', [
                'status' => $addDomainResponse->status(),
                'body' => $addDomainResponse->json()
            ]);

            if ($addDomainResponse->successful()) {
                // Add DNS records
                $this->addDnsRecords($domain, $vercelToken);

                $store->custom_domain_status = 'pending';
                $store->save();

                Log::info('Domain added successfully, waiting for DNS verification', [
                    'domain' => $domain,
                    'store_id' => $store->id
                ]);
            } else {
                $store->custom_domain_status = 'failed';
                $store->save();

                Log::error('Failed to add domain', [
                    'domain' => $domain,
                    'error' => $addDomainResponse->json(),
                    'store_id' => $store->id
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error in AddCustomDomainToVercel job', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'store_id' => $this->store->id
            ]);

            $this->store->custom_domain_status = 'failed';
            $this->store->save();
        }
    }

    private function addDnsRecords(string $domain, string $token): void
    {
        // Add CNAME record for www
        Http::withToken($token)
            ->post('https://api.vercel.com/v2/domains/' . $domain . '/records', [
                'name' => 'www',
                'type' => 'CNAME',
                'value' => 'cname.vercel-dns.com',
                'ttl' => 60
            ]);

        // Add A record for root domain
        Http::withToken($token)
            ->post('https://api.vercel.com/v2/domains/' . $domain . '/records', [
                'name' => '@',
                'type' => 'A',
                'value' => '76.76.21.21',
                'ttl' => 60
            ]);
    }
}
