<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SenderNetService
{
    private string $apiKey;
    private string $base_url = 'https://api.sender.net/v2';

    public function __construct()
    {
        $this->apiKey = config('services.sender_net.api_key');
    }

    public function sendCampaign(string $campaignId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->get($this->base_url . '/campaigns/' . $campaignId . '/send');
            if ($response->status() !== 200) {
                Log::error('Error sending campaign', ['error' => $response->json()]);
                throw new \Exception('Error sending campaign');
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Error sending campaign', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    //create subscriber
    public function createSubscriber(string $email, string $groupId, string $username)
    {
        $data = [
            'email' => $email,
            'groups' => [$groupId],
            'fields' => [
                'username' => $username,
            ],
            'trigger_automation' => true,
        ];
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->base_url . '/subscribers', $data);

            if ($response->status() !== 200) {
                Log::error('Error creating subscriber', ['error' => $response->json()]);
                throw new \Exception('Error creating subscriber');
            }

            Log::info('Subscriber created successfully', ['data' => $response->json()]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Error creating subscriber', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    //add subsriber to group
    public function addSubscriberToGroup(string $groupId, array $emails)
    {
        $data = [
            'subscribers' => $emails,
            'trigger_automation' => true,
        ];
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($this->base_url . '/subscribers/groups/' . $groupId, $data);
            if ($response->status() !== 200) {
                Log::error('Error adding subscriber to group', ['error' => $response->json()]);
                throw new \Exception('Error adding subscriber to group');
            }

            Log::info('Subscriber added to group successfully', ['data' => $response->json()]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Error adding subscriber to group', ['error' => $e->getMessage()]);
            throw $e;
        }
    }
}
