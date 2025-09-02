<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\FlutterwaveService;
use Illuminate\Support\Facades\App;

class UserResource extends JsonResource
{
    protected $flutterwave;

    public function __construct($resource)
    {
        parent::__construct($resource);
        $this->flutterwave = App::make(FlutterwaveService::class);
    }

    public function toArray(Request $request): array
    {
        // Base data for all user types
        $data = [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'role' => $this->roles->first()->name ?? null,
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'is_banned' => $this->is_banned,
            'banned_at' => $this->banned_at,
            'ban_reason' => $this->ban_reason,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'disable_payouts' => $this->disable_payouts,
            'is_impersonated' => $this->isImpersonated(),
            'twitter_avatar' => $this->twitter_avatar,
            'google_avatar' => $this->google_avatar,
        ];

        // Handle store URL generation
        $storeUrl = null;
        //if store has custom domain, use it else use subdomain
        if ($this->store) {
            if ($this->store->custom_domain) {
                $storeUrl = 'https://' . $this->store->custom_domain;
            } else {
                if (env('APP_ENV') == 'production') {
                    $storeUrl = 'https://' . $this->store->subdomain . '.' . env('FRONTEND_DOMAIN');
                } else {
                    $storeUrl = 'http://' . $this->store->subdomain . '.' . env('FRONTEND_DOMAIN');
                }
            }
        }

        // Add creator/admin specific data
        if ($this->isCreator() || $this->isAdmin()) {
            // Get banks list for creators/admins
            $allBanks = $this->flutterwave->getBankList();
            $excludedBankCodes = [
                // '090267', // Kuda Bank
                // '100004', // Opay
                '100033', // Palmpay
                // '090405', // Moniepoint
                '090328', // Eyowo
            ];

            $availableBanks = array_values(array_filter($allBanks, function ($bank) use ($excludedBankCodes) {
                return !in_array($bank['code'], $excludedBankCodes);
            }));

            if ($this->store) {
                $data = array_merge($data, [
                    'store_name' => $this->store?->name,
                    'subdomain' => $this->store?->subdomain,
                    'store_url' => $storeUrl,
                    'availableBanks' => $availableBanks,
                    'bank_code' => $this->bank_code,
                    'bank_id' => $this->bank_id,
                    'bank_name' => $this->bank_name,
                    'bank_account_name' => $this->bank_account_name,
                    'bank_account_number' => $this->bank_account_number,
                    'payment_schedule' => $this->payment_schedule,
                    'phone_number' => $this->phone_number,
                    'description' => $this->description,

                ]);
            }

            // Add additional admin/creator specific fields
            // $data['account_details'] = [
            //     'phone_number' => $this->phone_number,
            //     'description' => $this->description,
            //     'is_banned' => $this->is_banned,
            //     'banned_at' => $this->banned_at,
            //     'ban_reason' => $this->ban_reason,
            // ];
        }

        // Add customer specific data
        if ($this->isCustomer()) {
            $data['customer'] = [
                'orders_count' => $this->orders()->count(),
                'last_order_date' => $this->orders()->latest()->first()?->created_at,
            ];
        }

        return $data;
    }
}
