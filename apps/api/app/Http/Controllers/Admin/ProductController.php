<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'role:admin',
            'is_not_banned',
        ];
    }


    /**
     * Display a listing of all products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with('user');

        //Filter by published status
        if ($request->has('status')) {
            $status = $request->input('status');
            if ($status === 'published') {
                $query->where('is_published', true);
            } else if ($status === 'unpublished') {
                $query->where('is_published', false);
            }
        }

        //Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        //Filter by product type
        if ($request->has('product_type')) {
            $query->where('product_type', $request->input('product_type'));
        }

        // Search in name and description
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Sorting
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        $allowedSortFields = [
            'name',
            'price',
            'created_at',
            'updated_at',
            'sales_count'
        ];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $products = $query->paginate($perPage);

        return response()->json([
            'data' => ProductResource::collection($products),
            'meta' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);
    }

    /**
     * Update the status of the specified product.
     */
    public function updateStatus(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'is_published' => 'required|boolean',
        ]);

        $product->update([
            'is_published' => $validated['is_published']
        ]);

        return response()->json([
            'message' => $validated['is_published']
                ? 'Product has been published.'
                : 'Product has been unpublished.',
            'product' => new ProductResource($product->fresh(['user'])),
        ]);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product): JsonResponse
    {

        $productName = $product->name;


        //Delete associated files first
        if ($product->product_file) {
            $path = $product->product_file;
            Storage::disk('public')->delete($path);
        }

        if ($product->cover_image) {
            $path = $product->cover_image;
            Storage::disk('public')->delete($path);
        }

        $product->delete();

        return response()->json([
            'message' => "Product {$productName} deleted successfully"
        ]);
    }
}
