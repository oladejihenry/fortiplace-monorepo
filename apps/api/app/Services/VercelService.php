<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VercelService
{
    protected $baseUrl;
    protected $token;
    protected $teamId;
    protected $projectId;
    public function __construct()
    {
        $this->baseUrl = 'https://api.vercel.com/v9/projects/';
        $this->token = config('services.vercel.token');
        $this->teamId = config('services.vercel.team_id');
        $this->projectId = config('services.vercel.project_id');
    }

    public function getVerificationDetails($domain)
    {

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . $this->projectId . '/domains/' . $domain);

            if ($response->successful()) {
                $data = $response->json();

                $isVerified = $data['verified'] ?? false;

                // $dnsRecords = $this->checkDnsConfiguration($domain);

                return [
                    'verified' => $isVerified,  // Only true if both conditions are met
                    'verification_records' => $data['verification'] ?? [],
                    'dns_records' => [
                        [
                            'type' => 'TXT',
                            'host' => '_vercel',
                            'value' => $data['verification'][0]['value'] ?? '',
                            'ttl' => 'Automatic'
                        ],
                        [
                            'type' => 'CNAME',
                            'host' => 'www',
                            'value' => 'cname.vercel-dns.com',
                            'ttl' => 'Automatic'
                        ],
                        [
                            'type' => 'A',
                            'host' => '@',
                            'value' => '76.76.21.21',
                            'ttl' => 'Automatic'
                        ]
                    ],
                    // 'dns_configured' => $dnsRecords['dns_configured'] ?? false
                ];
            }

            return [
                'verified' => false,
                'verification_records' => [],
                'dns_records' => [],
                'dns_configured' => false
            ];
        } catch (\Exception $e) {
            Log::error('Error getting verification details', [
                'domain' => $domain,
                'error' => $e->getMessage()
            ]);
        }
    }


    public function checkDnsConfiguration($domain)
    {
        Log::info('Checking DNS Configuration for ' . $domain);
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/domains/' . $domain . '/records', [
                'teamId' => $this->teamId,
            ]);

            Log::info('DNS Records Here', ['response' => $response->json()]);

            if ($response->successful()) {
                $records = $response->json();

                $hasRequiredRecords = collect($records)->contains(function ($record) {
                    return $record['type'] === 'A' &&
                        $record['name'] === '@' &&
                        $record['value'] === '76.76.21.21';
                }) && collect($records)->contains(function ($record) {
                    return $record['type'] === 'CNAME' &&
                        $record['name'] === 'www' &&
                        $record['value'] === 'cname.vercel-dns.com';
                });

                return [
                    'records' => $records,
                    'configured' => $hasRequiredRecords
                ];
            }

            return [
                'records' => [],
                'configured' => false
            ];
        } catch (\Exception $e) {
            Log::error('Error checking DNS configuration', [
                'domain' => $domain,
                'error' => $e->getMessage()
            ]);
        }
    }


    public function removeCustomDomain($domain)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->token,
                'Content-Type' => 'application/json',
            ])->delete($this->baseUrl . $this->projectId . '/domains/' . $domain, [
                'teamId' => $this->teamId
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Custom domain removed successfully'
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to remove custom domain'
            ];
        } catch (\Exception $e) {
            Log::error('Error removing custom domain', [
                'domain' => $domain,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Failed to remove custom domain'
            ];
        }
    }
}
