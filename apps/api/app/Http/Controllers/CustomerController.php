<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CustomerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }
    public function index(Request $request)
    {
        $user = $request->user();

        $customers = Order::with(['items.product.user'])
            ->whereHas('items', function ($query) use ($user) {
                $query->where('seller_id', $user->id);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('customer_email', 'like', "%{$search}%")
                        ->orWhere('order_id', 'like', "%{$search}%")
                        ->orWhereJsonContains('metadata->customer_details->firstName', $search)
                        ->orWhereJsonContains('metadata->customer_details->lastName', $search);
                });
            })
            ->latest()
            ->paginate(10);

        return CustomerResource::collection($customers);
    }

    public function show(Order $order)
    {
        return new CustomerResource($order->load(['items.product.user', 'product.user']));
    }
}
