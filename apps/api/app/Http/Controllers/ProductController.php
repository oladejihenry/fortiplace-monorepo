<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductDraftRequest;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Response;
use App\Services\ProductService;
use App\Http\Requests\UpdateProductDraftRequest;
use Illuminate\Support\Facades\Gate;
use Mews\Purifier\Facades\Purifier;
use Illuminate\Support\Facades\Log;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Services\ProductFileService;

class ProductController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }

    private ProductService $productService;
    private ProductFileService $productFileService;

    public function __construct(ProductService $productService, ProductFileService $productFileService)
    {
        $this->productService = $productService;
        $this->productFileService = $productFileService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResource
    {
        $user = $request->user();

        $products = Product::query()
            ->byCreator($user)
            ->with('user')
            ->when(
                $request->boolean('published_only'),
                fn($query) => $query->published()
            )
            ->when(
                $request->has('search'),
                fn($query) => $query->where('name', 'like', "%{$request->search}%")
            )
            ->latest()
            ->paginate(15);

        return ProductResource::collection($products);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request): JsonResource
    {
        $validated = $request->validated();

        $validated['is_published'] = true;

        $product = $request->user()->products()->create($validated);

        return new ProductResource($product->load('user'));
    }

    /**
     * Create a new draft product.
     */
    public function createDraft(CreateProductDraftRequest $request)
    {
        $product = $this->productService->createDraftProduct($request->user(), $request->validated());

        return response()->json([
            'id' => $product->product_id,
        ], 201);
    }

    /**
     * Get a draft product.
     */
    public function getDraft(string $productId)
    {
        $product = $this->productService->getDraftProduct($productId);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return new ProductResource($product->load('user'));
    }

    /**
     * Update a draft product.
     */
    public function updateDraft(UpdateProductDraftRequest $request, string $productId)
    {
        try {
            $validated = $request->validated();
            $fileHash = $validated['file_hash'] ?? null;

            //Get the product
            $product = $this->productService->getDraftProduct($productId);

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found'
                ], 404);
            }
            if ($fileHash) {
                $tempFile = $this->productFileService->findTemporaryFileByHash($fileHash);

                if ($tempFile) {
                    // Convert temporary file to permanent and associate with product
                    $this->productFileService->convertTemporaryToPermanent($tempFile, $product);
                }
            }

            $product = $this->productService->updateDraftProduct($productId, $validated);

            return new ProductResource($product->load('user', 'activeFile'));
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update product'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        Gate::authorize('show', $product);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return new ProductResource($product->load('user'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product): JsonResource
    {
        //This is where to update the product
        Gate::authorize('update', $product);
        $validated = $request->validated();

        $fileHash = $validated['file_hash'] ?? null;


        if ($fileHash) {
            $tempFile = $this->productFileService->findTemporaryFileByHash($fileHash);

            if ($tempFile) {
                // Convert temporary file to permanent and associate with product
                $this->productFileService->convertTemporaryToPermanent($tempFile, $product);
            }
        }


        if (isset($validated['content'])) {
            $purifiedContent = Purifier::clean($validated['content']);
            $validated['content'] = $purifiedContent;
        }

        // if (!isset($validated['is_published']) || $validated['is_published'] !== false) {
        //     $validated['is_published'] = true;
        // }

        $product->update($validated);

        return new ProductResource($product->load('user'));
    }

    public function publish(Product $product, Request $request)
    {
        $validated = $request->validate([
            'is_published' => 'required|boolean',
        ]);


        //check if the product has product file, content, price and description
        if (!$product->activeFile || !$product->content || !$product->price || !$product->description) {
            $missing = [];
            if (!$product->activeFile) $missing[] = 'file';
            if (!$product->content) $missing[] = 'content';
            if (!$product->price) $missing[] = 'price';
            if (!$product->description) $missing[] = 'description';

            return response()->json([
                'message' => 'Complete missing fields: ' . implode(', ', $missing)
            ], 400);
        }

        $product->update([
            'is_published' => $validated['is_published']
        ]);

        return response()->json([
            'message' => 'Product published successfully'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): Response
    {
        $this->productService->deleteProduct($product);

        return response()->noContent();
    }
}
