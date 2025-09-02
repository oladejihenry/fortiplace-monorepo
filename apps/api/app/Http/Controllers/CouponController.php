<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use App\Services\CouponService;
use App\Http\Requests\CouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class CouponController extends Controller
{
    public function __construct(private CouponService $couponService) {}

    public function index(Request $request)
    {
        try {
            $coupons = $this->couponService->getCouponsByCreator($request->user());
            return response()->json([
                'coupons' => $coupons,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    public function store(CouponRequest $request)
    {
        try {
            $coupon = $this->couponService->createCoupon($request->validated(), $request->user());

            return response()->json([
                'message' => 'Coupon created successfully',
                'coupon' => $coupon,
                'status' => 201,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Coupon $coupon)
    {
        $user = $request->user();
        try {
            return response()->json([
                'coupon' => $coupon->load('creator'),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coupon $coupon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCouponRequest $request, Coupon $coupon)
    {
        if ($coupon->creator_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {

            $this->couponService->updateCoupon(
                $coupon,
                $request->validated()
            );

            return response()->json([
                'status' => 201,
                'message' => 'Coupon updated successfully',
                'coupon' => $coupon->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update coupon: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update coupon'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted successfully', 'status' => 200]);
    }


    public function applyCoupon(Request $request)
    {
        $request->validate([
            'couponCode' => 'required|string',
            'total_amount' => 'required|numeric|min:0',
            'currency' => 'required|string',
            'productIds' => 'required|array',
            // 'productIds.*' => 'required|exists:products,product_id'
        ]);
        try {
            $firstProduct = Product::where('id', $request->productIds[0])->first();

            Log::info('First product: ' . $firstProduct);

            if (!$firstProduct) {
                return response()->json(['error' => 'Product not found'], 400);
            }
            $coupon = $this->couponService->validateCouponCode(
                $request->couponCode,
                $firstProduct->user_id,
                $request->total_amount
            );
            if (!$coupon) {
                return response()->json(['error' => 'Invalid or expired coupon code'], 400);
            }
            //calculate discount using the coupon
            $discountResult = $coupon->calculateDiscount($request->total_amount);
            return response()->json([
                'success' => true,
                'message' => 'Coupon applied successfully',
                'coupon_code' => $discountResult['coupon_code'],
                'coupon_type' => $discountResult['coupon_type'],
                'coupon_value' => $discountResult['coupon_value'],
                'discount_amount' => $discountResult['discount_amount'],
                'final_amount' => $discountResult['final_amount'],
                'original_amount' => $discountResult['original_amount']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
