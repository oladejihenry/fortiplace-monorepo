<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Integration;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\IntegrationResource;

class IntegrationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $integrations = Integration::where('user_id', $user->id)->first();

        if (!$integrations) {
            return response()->json(['message' => 'No integrations found'], 404);
        }

        return new IntegrationResource($integrations);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $store = $user->store;

        $request->validate([
            'googleTag' => 'required|string',
            'facebookUsername' => 'required|string',
            // 'metaPixel' => 'required|string',
            'twitterUsername' => 'required|string',
        ]);

        $integration = Integration::updateOrCreate([
            'user_id' => $user->id,
            'store_id' => $store->id,
        ], [
            'googleTag' => $request->googleTag,
            'facebookUsername' => $request->facebookUsername,
            // 'metaPixel' => $request->metaPixel,
            'twitterUsername' => $request->twitterUsername,
        ]);

        return response()->json($integration);
    }
}
