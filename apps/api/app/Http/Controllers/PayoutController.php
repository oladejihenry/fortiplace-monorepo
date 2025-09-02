<?php

namespace App\Http\Controllers;

use App\Models\Payout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PayoutController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $payouts = Payout::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'payouts' => $payouts,
            'message' => 'Payout history retrieved successfully',
        ]);
    }

    public function show(Request $request, string $reference): JsonResponse
    {
        $user = $request->user();

        $payout = Payout::where('user_id', $user->id)
            ->where('reference', $reference)
            ->firstOrFail();

        // Get the order items included in this payout
        $orderItems = $payout->orderItems()
            ->with(['product', 'order'])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'order_id' => $item->order->order_id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                    'commission' => $item->commission_amount,
                    'earnings' => $item->seller_amount,
                    'created_at' => $item->created_at,
                    'customer_email' => $item->order->customer_email
                ];
            });

        return response()->json([
            'payout' => [
                'id' => $payout->id,
                'reference' => $payout->reference,
                'amount' => $payout->amount,
                'currency' => $payout->currency,
                'status' => $payout->status,
                'bank_account_name' => $payout->bank_account_name,
                'bank_account_number' => '****' . substr($payout->bank_account_number, -4),
                'created_at' => $payout->created_at,
                'processed_at' => $payout->processed_at,
                'order_items' => $orderItems,
            ],
            'message' => 'Payout details retrieved successfully',
        ]);
    }
}
