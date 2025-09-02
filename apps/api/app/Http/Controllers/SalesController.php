<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class SalesController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }
    public function sales(Request $request)
    {
        $user = $request->user();

        //get all paid order items IDs
        $paidOrderItemIds = DB::table('order_item_payout')
            ->join('payouts', 'order_item_payout.payout_id', '=', 'payouts.id')
            ->where('payouts.status', 'completed')
            ->pluck('order_item_id')
            ->toArray();

        //get the user's store product sales i.e the products that have been sold
        $sales = OrderItem::where('seller_id', $user->id)
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'success');
            })
            ->whereNotIn('id', $paidOrderItemIds) // Only include items that haven't been paid out
            ->with(['product', 'order'])
            ->get();

        $totalStats = [
            'total_items_sold' => $sales->sum('quantity'),
            'total_sales_amount' => $sales->sum('total_price'),
            'total_commission' => $sales->sum('commission_amount'),
            'net_earnings' => $sales->sum('seller_amount'),
            'total_sales_amount_ngn' => $sales->sum('total_price_ngn'),
        ];

        //Get monthly sales data
        $monthlyStats = OrderItem::where('seller_id', $user->id)
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'success');
            })
            ->select(
                DB::raw('EXTRACT(YEAR FROM created_at) as year'),
                DB::raw('EXTRACT(MONTH FROM created_at) as month'),
                DB::raw('SUM(quantity) as items_sold'),
                DB::raw('SUM(total_price) as sales_amount'),
                DB::raw('SUM(commission_amount) as total_commission'),
                DB::raw('SUM(seller_amount) as earnings')
            )
            ->groupBy(
                DB::raw('EXTRACT(YEAR FROM created_at)'),
                DB::raw('EXTRACT(MONTH FROM created_at)')
            )
            ->orderBy(DB::raw('EXTRACT(YEAR FROM created_at)'), 'desc')
            ->orderBy(DB::raw('EXTRACT(MONTH FROM created_at)'), 'desc')
            ->get();

        return response()->json([
            'message' => 'Sales data retrieved successfully',
            'sales' => $sales,
            'total_stats' => $totalStats,
            'monthly_stats' => $monthlyStats,
            'sales' => $sales->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'order_id' => $sale->order->order_id,
                    'product_name' => $sale->product->name,
                    'quantity' => $sale->quantity,
                    'unit_price' => $sale->unit_price,
                    'total_price' => $sale->total_price,
                    'commission' => $sale->commission_amount,
                    'earnings' => $sale->seller_amount,
                    'status' => $sale->status,
                    'download_count' => $sale->download_count,
                    'created_at' => $sale->created_at,
                    'customer_email' => $sale->order->customer_email
                ];
            })
        ]);
    }

    public function salesStats(Request $request)
    {
        $user = $request->user();
        $period = $request->input('period', 'all');

        $query = OrderItem::where('seller_id', $user->id)
            ->whereHas('order', function ($query) {
                $query->where('payment_status', 'success');
            });

        switch ($period) {
            case 'year':
                $query->where('created_at', '>=', now()->startOfYear());
                break;
            case 'month':
                $query->where('created_at', '>=', now()->startOfWeek());
                break;
            case 'week':
                $query->whereBetween('created_at', [
                    now()->startOfWeek(),
                    now()->endOfWeek()
                ]);
                break;
        }

        $stats = [
            'total_items_sold' => $query->sum('quantity'),
            'total_sales_amount' => $query->sum('total_price'),
            'total_commission' => $query->sum('commission_amount'),
            'net_earnings' => $query->sum('seller_amount'),
            'orders_count' => $query->count(),
            'period' => $period
        ];

        return response()->json([
            'message' => 'Sales stats retrieved successfully',
            'stats' => $stats
        ]);
    }
}
