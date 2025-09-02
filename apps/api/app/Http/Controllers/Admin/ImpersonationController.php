<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\UserResource;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ImpersonationController extends Controller implements HasMiddleware
{
    //middleware admin
    public static function middleware(): array
    {
        return [
            new Middleware('role:admin', only: ['start']),
            new Middleware('is_not_banned', only: ['start']),
        ];
    }

    public function start(Request $request, User $user)
    {
        $admin = $request->user();
        if (!$admin->canImpersonate() || !$user->canBeImpersonated()) {
            return response()->json([
                'message' => 'You are not authorized to impersonate users.',
            ], 403);
        }

        $admin->impersonate($user);


        //issue token
        $token = $user->createToken("impersonated_by_{$admin->id}", ['impersonation'])->plainTextToken;


        return response()->json([
            'message' => 'You are now impersonating ' . $user->username,
            'user' => UserResource::make($user),
            'token' => $token,
        ]);
    }

    public function leave(Request $request)
    {
        $user = $request->user();

        if (method_exists($user, 'isImpersonated') && $user->isImpersonated()) {
            $impersonatorId = app('impersonate')->getImpersonatorId();
            $impersonator = User::find($impersonatorId);
            if (!$impersonator) {
                return response()->json([
                    'message' => 'Original admin not found.',
                ], 404);
            }
            $user->leaveImpersonation();

            $token = $impersonator->createToken('auth_token')->plainTextToken;

            $impersonatorResource = new UserResource($impersonator);
            $data = $impersonatorResource->toArray($request);
            $data['is_impersonated'] = false;

            return response()->json([
                'message' => 'You are no longer impersonating ' . $user->username,
                'user' => $data,
                'token' => $token,
            ]);
        }

        return response()->json([
            'message' => 'You are not impersonating any user.',
        ]);
    }
}
