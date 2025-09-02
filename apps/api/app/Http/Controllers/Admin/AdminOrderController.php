<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\Order;

class AdminOrderController extends Controller
{
    public function getOrderStats(Request $request)
    {
        try {
            Log::info('Fetching order stats', [
                'month' => $request->month ?? 'all time'
            ]);

            $query = Store::query()
                ->select([
                    'stores.id',
                    'stores.name as store_name',
                    'users.email as owner_email',
                    DB::raw('COALESCE(SUM(CASE 
                        WHEN orders.payment_status = ? AND 
                             orders.metadata::jsonb #> \'{products,0,seller,email}\' = to_jsonb(users.email)
                        THEN orders.amount_ngn 
                        ELSE 0 
                    END), 0) as total_amount'),
                    DB::raw('COALESCE(SUM(CASE 
                        WHEN orders.payment_status = ? AND 
                             orders.metadata::jsonb #> \'{products,0,seller,email}\' = to_jsonb(users.email)
                        THEN orders.seller_amount 
                        ELSE 0 
                    END), 0) as total_seller_amount')
                ])
                ->join('users', 'stores.user_id', '=', 'users.id')
                ->leftJoin('orders', function ($join) {
                    $join->whereRaw('orders.metadata::jsonb #> \'{products,0,seller,email}\' = to_jsonb(users.email)');
                })
                ->addBinding(Order::STATUS_SUCCESS, 'select')
                ->addBinding(Order::STATUS_SUCCESS, 'select');

            if ($request->has('month')) {
                $date = Carbon::parse($request->month);
                $query->where(function ($q) use ($date) {
                    $q->whereYear('orders.created_at', $date->year)
                        ->whereMonth('orders.created_at', $date->month);
                });
            }

            $stats = $query
                ->groupBy('stores.id', 'stores.name', 'users.email')
                ->orderByDesc('total_amount')
                ->get();

            // Calculate grand totals
            $grandTotal = $stats->sum('total_amount');
            $grandSellerTotal = $stats->sum('total_seller_amount');

            return response()->json([
                'data' => $stats->map(function ($store) {
                    return [
                        'store_name' => $store->store_name,
                        'owner_email' => $store->owner_email,
                        'total_amount' => number_format($store->total_amount, 2),
                        'total_amount_raw' => $store->total_amount,
                        'seller_amount' => number_format($store->total_seller_amount, 2),
                        'seller_amount_raw' => $store->total_seller_amount,
                    ];
                }),
                'grand_total' => number_format($grandTotal, 2),
                'grand_total_raw' => $grandTotal,
                'grand_seller_total' => number_format($grandSellerTotal, 2),
                'grand_seller_total_raw' => $grandSellerTotal,
                'currency' => 'NGN',
                'period' => $request->month ? Carbon::parse($request->month)->format('F Y') : 'All Time'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching order stats: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to fetch order statistics'
            ], 500);
        }
    }

    public function getStoreMonthlyStats(Request $request, Store $store)
    {
        try {
            $months = Order::query()
                ->select([
                    DB::raw('DATE_TRUNC(\'month\', created_at)::date as month'),
                    DB::raw('COALESCE(SUM(amount_ngn), 0) as total_amount'),
                    DB::raw('COALESCE(SUM(seller_amount), 0) as total_seller_amount')
                ])
                ->where('payment_status', Order::STATUS_SUCCESS)
                ->whereRaw('metadata::jsonb #> \'{products,0,seller,email}\' = ?::jsonb', [
                    json_encode($store->user->email)
                ])
                ->groupBy('month')
                ->orderBy('month', 'desc')
                ->limit(12)
                ->get();

            // Calculate totals
            $totalAmount = $months->sum('total_amount');
            $totalSellerAmount = $months->sum('total_seller_amount');

            return response()->json([
                'store_name' => $store->name,
                'owner_email' => $store->user->email,
                'monthly_stats' => $months->map(function ($month) {
                    return [
                        'month' => Carbon::parse($month->month)->format('F Y'),
                        'total_amount' => number_format($month->total_amount, 2),
                        'total_amount_raw' => $month->total_amount,
                        'seller_amount' => number_format($month->total_seller_amount, 2),
                        'seller_amount_raw' => $month->total_seller_amount
                    ];
                }),
                'total_amount' => number_format($totalAmount, 2),
                'total_amount_raw' => $totalAmount,
                'total_seller_amount' => number_format($totalSellerAmount, 2),
                'total_seller_amount_raw' => $totalSellerAmount,
                'currency' => 'NGN'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching store monthly stats: ' . $e->getMessage(), [
                'store_id' => $store->id,
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to fetch store monthly statistics'
            ], 500);
        }
    }
}
