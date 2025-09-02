<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Store;
use App\Enums\UserRole;

class CustomerOrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $orders = Order::with([
            'items.product.user.store'
        ])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    // public function show(Request $request, Order $order)

    public function upgradeAccount(Request $request)
    {
        $user = $request->user();
        //delete user previous role
        $user->removeRole(UserRole::CUSTOMER->value);
        //assign a new role to the user
        $user->assignRole(UserRole::CREATOR->value);

        //create subdomain for the user
        Store::create([
            'name' => strtolower($user->username),
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Account upgraded successfully'], 200);
    }
}
