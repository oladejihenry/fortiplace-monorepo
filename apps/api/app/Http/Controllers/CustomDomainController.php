<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\AddCustomDomainToVercel;
use App\Models\Store;
use App\Http\Resources\CustomDomainResource;
use Illuminate\Validation\Rule;
use App\Services\VercelService;

class CustomDomainController extends Controller
{
    protected $vercelService;

    public function __construct(VercelService $vercelService)
    {
        $this->vercelService = $vercelService;
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $store = $user->store;

        $request->validate([
            'domain' => [
                'required',
                'string',
                'max:255',
                Rule::unique('stores', 'custom_domain')->ignore($store->id)
            ]
        ]);

        $store->custom_domain = $request->domain;
        $store->custom_domain_status = 'pending';
        $store->save();

        //trigger a job to add domain to Vercel
        AddCustomDomainToVercel::dispatch($store);
        return response()->json([
            'success' => true,
            'message' => 'Custom domain request submitted successfully',
            'data' => [
                'custom_domain' => $store->custom_domain,
                'custom_domain_status' => $store->custom_domain_status,
            ],
        ]);
    }

    public function list(Request $request)
    {
        $user = $request->user();
        $stores = Store::where('user_id', $user->id)->get();


        return CustomDomainResource::collection($stores);
    }

    public function status(Request $request)
    {
        $user = $request->user();
        $store = $user->store;

        // Add null check for custom_domain
        if (!$store->custom_domain) {
            return response()->json([
                'success' => false,
                'message' => 'No custom domain set',
                'data' => [
                    'custom_domain' => null,
                    'custom_domain_status' => 'idle',
                    'verification' => [
                        'verified' => false,
                        'verification_records' => [],
                        'dns_records' => []
                    ]
                ],
            ]);
        }

        $verificationDetails = $this->vercelService->getVerificationDetails($store->custom_domain);

        // Check domain verification status
        if ($verificationDetails['verified']) {

            if ($store->custom_domain_status !== 'verified') {

                $store->custom_domain_status = 'verified';
                $store->save();
            }
        } else {
            // If not verified, ensure status is pending
            if ($store->custom_domain_status !== 'pending') {
                $store->custom_domain_status = 'pending';
                $store->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Custom domain status',
            'data' => [
                'custom_domain' => $store->custom_domain,
                'custom_domain_status' => $store->custom_domain_status,
                'verification' => $verificationDetails,
                'id' => $store->id
            ],
        ]);
    }

    public function remove(Request $request)
    {
        $user = $request->user();
        $store = $user->store;

        if (!$store->custom_domain) {
            return response()->json([
                'success' => false,
                'message' => 'No custom domain set'
            ]);
        }

        $response = $this->vercelService->removeCustomDomain($store->custom_domain);

        if ($response['success']) {
            $store->custom_domain = null;
            $store->custom_domain_status = 'pending';
            $store->save();
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove custom domain'
            ]);
        }

        return response()->json([
            'success' => $response['success'],
            'message' => $response['message']
        ]);
    }
}
