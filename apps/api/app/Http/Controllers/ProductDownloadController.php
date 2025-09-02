<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Aws\Exception\AwsException;
use Aws\S3\S3Client;
use Illuminate\Support\Str;
use setasign\Fpdi\Fpdi;

class ProductDownloadController extends Controller
{
    public function verifyToken(Request $request)
    {
        try {
            //verify the token
            $token = $request->query('token');


            if (!$token) {
                return response()->json([
                    'message' => 'Token is required'
                ], 400);
            }

            //decrypt the token
            $decrypted = decrypt($token);

            //check if token is valid and not expired
            if (!isset($decrypted['order_id']) || !isset($decrypted['email']) || !isset($decrypted['expires_at'])) {
                return response()->json(['message' => 'Invalid token format'], 400);
            }

            if ($decrypted['expires_at'] < now()->timestamp) {
                return response()->json(['message' => 'Download link has expired'], 403);
            }
            //verify the order exists
            $order = Order::where('id', $decrypted['order_id'])
                ->where('customer_email', $decrypted['email'])
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            //Load the order items with products
            $items = $order->items()->with('product.activeFile')->get();


            // Return the order and product information
            return response()->json([
                'order' => [
                    'id' => $order->order_id,
                    'customer_email' => $order->customer_email,
                    'created_at' => $order->created_at,
                    'total_amount' => $order->amount,
                    'currency' => $order->currency,
                ],
                'products' => $items->map(function ($item) use ($token) {
                    $product = $item->product;
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'description' => $product->description,
                        'product_type' => $product->product_type,
                        'file_name' => $product->activeFile?->original_name,
                        'view_product_online' => $product->view_product_online,
                        'download_url' => route('downloads.file', [
                            'order_id' => $item->order_id,
                            'product_id' => $item->product_id,
                            'token' => $token
                        ])
                    ];
                })
            ]);
        } catch (\Exception $e) {
            Log::error('Error verifying token: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while verifying the token'], 500);
        }
    }

    public function download(Request $request, string $order_id, string $product_id)
    {
        try {
            //verify the token
            $token = $request->query('token');
            if (!$token) {
                return response()->json(['message' => 'Token is required'], 400);
            }

            //decrypt the token
            $decrypted = decrypt($token);

            //check if token is valid and not expired
            if ($decrypted['order_id'] !== $order_id || $decrypted['expires_at'] < now()->timestamp) {
                return response()->json(['message' => 'Invalid or expired token'], 403);
            }

            //Get the product
            $product = Product::findOrFail($product_id);

            //verify the product belongs to the order
            $order = Order::findOrFail($order_id);

            $orderItem = $order->items()->where('product_id', $product_id)->first();


            if (!$orderItem) {
                return response()->json(['message' => 'Product not found in order'], 404);
            }

            $downloadInfo = $this->generateDownloadUrls($order);

            $productDownload = $downloadInfo->firstWhere('product_id', $product_id);


            if (!$productDownload) {
                return response()->json(['message' => 'Download information not found'], 404);
            }

            return redirect()->away($productDownload['download_url']);
        } catch (\Exception $e) {
            Log::error('Error verifying token: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while verifying the token'], 500);
        }
    }

    public function resendDownloadLink(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
            'email' => 'required|email',
        ]);

        $order = Order::where('order_id', $request->order_id)
            ->where('customer_email', $request->email)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }


        //expires in 30 days
        $expiresAt = now()->addDays(30)->timestamp;


        $token = encrypt([
            'order_id' => $order->id,
            'email' => $order->customer_email,
            'expires_at' => $expiresAt,
        ]);

        $frontendUrl = env('FRONTEND_URL');
        $downloadUrl = "{$frontendUrl}/downloads/{$order->order_id}?token={$token}";

        return response()->json([
            'token' => $token,
            'download_url' => $downloadUrl,
            'expires_at' => $expiresAt,
        ]);
    }

    private function generateDownloadUrls($order)
    {
        $s3Client = new S3Client([
            'version' => 'latest',
            'region' => env('DO_SPACES_REGION'),
            'endpoint' => env('DO_SPACES_ENDPOINT'),
            'url' => env('DO_SPACES_URL'),
            'credentials' => [
                'key' => env('DO_SPACES_KEY'),
                'secret' => env('DO_SPACES_SECRET'),
            ],
            'use_path_style_endpoint' => true,
        ]);

        return $order->items->map(function ($item) use ($s3Client, $order) {
            try {
                // Load the product with its active file
                $product = $item->product->load('activeFile');

                // Check if there's an active file
                if (!$product->activeFile) {
                    throw new \Exception('No active file found for product');
                }

                // Get the storage path directly from the ProductFile model
                $path = $product->activeFile->storage_path;

                if (empty($path)) {
                    throw new \Exception('Invalid file path');
                }

                $extension = $product->activeFile->getFileExtension();

                // If it's a PDF and email footer is enabled, process the PDF

                if (strtolower($extension) === 'pdf' && $product->add_customer_email_to_pdf_footer) {
                    // Ensure temp directory exists
                    $tempDir = storage_path('app/temp');
                    if (!file_exists($tempDir)) {
                        mkdir($tempDir, 0755, true);
                    }

                    // Create a unique temporary filename
                    $tempFileName = uniqid() . '.pdf';
                    $tempPath = $tempDir . '/' . $tempFileName;

                    // Download the file from S3/Spaces to local temp storage
                    try {
                        $fileContents = Storage::disk($product->activeFile->storage_disk)->get($path);
                        file_put_contents($tempPath, $fileContents);

                        // Add email to PDF footer
                        $processedPath = $this->addEmailToPdf($tempPath, $order->customer_email);

                        // Upload processed PDF back to storage with a unique name
                        $processedFileName = 'processed_' . uniqid() . '_' . basename($path);
                        $processedStoragePath = dirname($path) . '/' . $processedFileName;

                        // Upload the processed file back to S3/Spaces
                        Storage::disk($product->activeFile->storage_disk)->put(
                            $processedStoragePath,
                            file_get_contents($processedPath)
                        );

                        // Clean up temporary files
                        if (file_exists($tempPath)) {
                            unlink($tempPath);
                        }
                        if (file_exists($processedPath)) {
                            unlink($processedPath);
                        }

                        // Use the processed file path
                        $path = $processedStoragePath;
                    } catch (\Exception $e) {
                        Log::error('Failed to process PDF', [
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString(),
                            'temp_path' => $tempPath,
                            'original_path' => $path
                        ]);
                        // Continue with original file if processing fails
                    }
                }

                // Create a better filename using the product name
                $cleanName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $product->name);
                $userFriendlyFilename = $cleanName . '.' . $product->activeFile->getFileExtension();

                // Get content type from the stored mime type
                $contentType = $product->activeFile->mime_type;

                // Use quoted-string format for the filename with proper encoding
                $contentDisposition = "attachment; filename*=UTF-8''" . rawurlencode($userFriendlyFilename);

                $command = $s3Client->getCommand('GetObject', [
                    'Bucket' => env('DO_SPACES_BUCKET'),
                    'Key' => $path,
                    'ResponseContentDisposition' => $contentDisposition,
                    'ResponseContentType' => $contentType,
                ]);

                $presignedUrl = $s3Client->createPresignedRequest($command, '+7 days')->getUri();

                //cdn url
                // $cdnUrl = $this->transformToCdnUrl((string)$presignedUrl);

                // Log::info('CDN URL', ['url' => $cdnUrl]);


                $item->markAsDownloaded();

                $productType = str_replace('_', ' ', $product->product_type->value);

                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'download_url' => $presignedUrl,
                    'product_type' => $productType,
                    'file_name' => $userFriendlyFilename,
                    'expires_in' => '7 days'
                ];
            } catch (\Exception $e) {
                Log::error('Failed to generate download URL', [
                    'item_id' => $item->id,
                    'product_id' => $item->product_id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                $item->update(['status' => 'failed']);

                return [
                    'product_id' => $item->product->id,
                    'product_name' => $item->product->name,
                    'error' => 'Failed to generate download URL'
                ];
            }
        });
    }

    public function addEmailToPdf(string $pdfPath, string $customerEmail): string
    {
        try {
            // Create new PDF instance
            $pdf = new Fpdi();

            // Get the number of pages
            $pageCount = $pdf->setSourceFile($pdfPath);

            // Process each page
            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                // Import page
                $templateId = $pdf->importPage($pageNo);

                // Get the size of the imported page
                $size = $pdf->getTemplateSize($templateId);

                // Add page with same orientation and size as source
                $pdf->AddPage(
                    $size['orientation'],
                    [$size['width'], $size['height']]
                );

                // Import the content from the source page
                $pdf->useTemplate($templateId, 0, 0, $size['width'], $size['height']);

                // Set up the header text
                $pdf->SetFont('Helvetica', '', 8);
                $pdf->SetTextColor(128, 128, 128); // Gray color

                // Position at top right - adjust these values as needed
                $pdf->SetXY(
                    $size['width'] - 100, // X position from right (increased space for text)
                    10  // Y position from top
                );

                // Add the text
                $pdf->Write(0, "Licensed to {$customerEmail} by Fortiplace");
            }

            // Generate output path
            $outputPath = storage_path('app/temp/processed_' . uniqid() . '.pdf');

            // Save the new PDF
            $pdf->Output('F', $outputPath);

            return $outputPath;
        } catch (\Exception $e) {
            Log::error('Failed to add email to PDF', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // If processing fails, return original file
            return $pdfPath;
        }
    }

    private function transformToCdnUrl(string $presignedUrl): string
    {
        $parsed = parse_url($presignedUrl);
        $path = str_replace('/creating/', '/', $parsed['path']);
        $query = isset($parsed['query']) ? '?' . $parsed['query'] : '';
        return env('DO_SPACES_URL') . $path . $query;
    }

    private function getMimeTypeForExtension($extension)
    {
        $mimeTypes = [
            'pdf' => 'application/pdf',
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'mp3' => 'audio/mpeg',
            'mp4' => 'video/mp4',
            // Add more as needed
        ];

        return $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }
}
