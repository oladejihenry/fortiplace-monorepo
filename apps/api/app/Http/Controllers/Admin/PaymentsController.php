<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Log;

class PaymentsController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:admin', only: ['list']),
            new Middleware('is_not_banned', only: ['list']),
        ];
    }
    public function list(Request $request)
    {
        $query = Order::query();

        //Add user email filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($query) use ($search) {
                $query->where('email', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('payment_status')) {
            $status = $request->input('payment_status');
            if (in_array($status, Order::getValidStatuses())) {
                $query->where('payment_status', $status);
            }
        }

        // Add payment gateway filter
        if ($request->has('payment_gateway')) {
            $gateway = $request->input('payment_gateway');
            $query->where('payment_gateway', $gateway);
        }

        //Add payment reference filter
        if ($request->has('payment_reference')) {
            $reference = $request->input('payment_reference');
            $query->where('payment_reference', $reference);
        }

        //Add date range filtering if provided
        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        //Add sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        //Add pagination
        $perPage = $request->input('per_page', 15);
        $payments = $query->paginate($perPage);

        return PaymentResource::collection($payments);
    }
}
