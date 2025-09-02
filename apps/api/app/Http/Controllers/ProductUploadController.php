<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Helpers\FileHash;
use App\Models\Product;
use App\Models\ProductFile;
use App\Services\ProductFileService;

class ProductUploadController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('is_not_banned'),
        ];
    }

    public function __construct(
        private ProductFileService $productFileService
    ) {}

    public function uploadProductFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,zip,rar,jpeg,png,jpg|max:102400', // 100MB
            'product_id' => 'nullable|string|exists:products,product_id',
        ]);

        try {
            $file = $request->file('file');
            $user = $request->user();

            //Generate hash of the file
            $fileHash = FileHash::hash($file->getRealPath());

            //Check if the file already exists and for the same user
            $existingFile = ProductFile::where('file_hash', $fileHash)
                ->whereNotNull('product_id')
                ->whereHas('product', function ($query) use ($user) {
                    $query->where('user_id', '!=', $user->id);
                })
                ->first();

            if ($existingFile) {
                return response()->json([
                    'message' => 'This file appears to be a duplicate of an existing product'
                ], 409);
            }

            if ($request->has('product_id')) {
                $product = Product::where('product_id', $request->product_id)
                    ->where('user_id', $user->id)
                    ->firstOrFail();

                $productFile = $this->productFileService->storeFile($product, $file);

                return response()->json([
                    'url' => $productFile->getDownloadUrl(60),
                    'file_hash' => $fileHash,
                    'metadata' => [
                        'name' => $productFile->original_name,
                        'size' => $productFile->file_size,
                        'type' => $productFile->mime_type,
                        'temporary' => false
                    ]
                ]);
            }

            $productFile = $this->productFileService->storeTemporaryFile(
                $file,
                $fileHash,
                [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'uploaded_by' => $user->id
                ]
            );

            // $filename = Str::random(40) . '.' . $extension;

            // $path = Storage::disk('spaces')->putFileAs('product-files', $file, $filename, ['visibility' => 'public']);

            // $spacesUrl = env('DO_SPACES_ENDPOINT') . '/' . env('DO_SPACES_BUCKET') . '/' . $path;

            return response()->json([
                'url' => $productFile->getDownloadUrl(60), // 60 minutes temporary URL
                'file_hash' => $fileHash,
                'metadata' => [
                    'name' => $productFile->original_name,
                    'size' => $productFile->file_size,
                    'type' => $productFile->mime_type,
                    'temporary' => true,
                    'expires_in' => '60 minutes'
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Product file upload failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Upload failed'
            ], 500);
        }
    }

    public function deleteProductFile(Request $request)
    {
        $request->validate([
            'path' => 'nullable|string',
            'file_hash' => 'nullable|string'
        ]);

        try {
            $user = $request->user();
            $path = $request->input('path');

            //if file_hash is provided, find the file
            if ($request->has('file_hash')) {
                $file = ProductFile::where('file_hash', $request->file_hash)
                    ->where(function ($query) use ($user) {
                        $query->whereNull('product_id')
                            ->orWhereHas('product', function ($q) use ($user) {
                                $q->where('user_id', $user->id);
                            });
                    })
                    ->first();

                if ($file) {
                    $this->productFileService->deleteFile($file);
                    return response()->json(['message' => 'File deleted successfully']);
                }
            }

            // Fallback to path-based deletion
            if ($request->has('path')) {
                $path = $request->input('path');

                // Clean up the path from the full URL
                if (Str::startsWith($path, 'http')) {
                    // Extract the path after the bucket name
                    $parts = parse_url($path);
                    $fullPath = $parts['path'] ?? '';
                    $path = Str::after($fullPath, '/' . env('DO_SPACES_BUCKET') . '/');

                    // Remove any query parameters
                    $path = explode('?', $path)[0];
                }

                Log::info('Attempting to delete file at path: ' . $path);

                if (Storage::disk('spaces')->exists($path)) {
                    Storage::disk('spaces')->delete($path);
                    return response()->json(['message' => 'File deleted successfully']);
                }
            }

            return response()->json(['message' => 'File not found'], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete file: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete file'
            ], 500);
        }
    }

    /**
     * Upload cover image
     */
    public function uploadCoverImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // 2MB
        ]);

        try {
            $file = $request->file('file');

            $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();

            $path = Storage::disk('spaces')->putFileAs('cover-images', $file, $filename, ['visibility' => 'public']);

            $spacesUrl = env('DO_SPACES_URL') . '/' . $path;

            return response()->json([
                'url' => $spacesUrl,
                'path' => $path,
                'name' => $file->getClientOriginalName()
            ], 200);
        } catch (\Exception $e) {
            Log::error('Cover image upload failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Upload failed'
            ], 500);
        }
    }

    public function deleteCoverImage(Request $request)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        try {
            $path = $request->input('path');

            if (Str::startsWith($path, 'http')) {
                $path = Str::after($path, env('DO_SPACES_BUCKET') . '/');
            }

            if (Storage::disk('spaces')->exists($path)) {
                Storage::disk('spaces')->delete($path);
                return response()->json(['message' => 'Cover image deleted successfully']);
            }

            return response()->json(['message' => 'Cover image not found'], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete cover image: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete cover image'
            ], 500);
        }
    }
}
