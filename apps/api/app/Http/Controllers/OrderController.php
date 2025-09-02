<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Events\OrderCompleted;
use App\Models\OrderItem;
use Aws\Exception\AwsException;
use Aws\S3\S3Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\PaymentGateway\PaymentGatewayFactory;
use App\Services\ProductPurchaseValidationService;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OrderController extends Controller
{
    private $purchaseValidationService;
    public function __construct(
        ProductPurchaseValidationService $purchaseValidationService
    ) {
        $this->purchaseValidationService = $purchaseValidationService;
    }

    public function initiatePayment(Request $request)
    {
        Log::info('Initiate payment', $request->all());

        $request->validate([
            'email' => 'required|email',
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'country' => 'required|string',
            'phone' => 'nullable|string',
            'orderNote' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,product_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.currency' => 'required|string',
            'totalPrice' => 'required|numeric|min:0',
            'idempotency_key' => 'required|string|max:100',
            'coupon_code' => 'nullable|string',
            'discount_amount' => 'nullable|numeric|min:0',
        ]);

        $user = $request->user();
        $idempotencyKey = $request->idempotency_key;
        $customerCurrency = $request->items[0]['currency'];
        $discountAmount = $request->discount_amount ?? 0;
        $couponCode = $request->coupon_code;

        try {
            // Check for existing order with same idempotency key
            $existingOrder = Order::where('idempotency_key', $idempotencyKey)->first();

            if ($existingOrder) {
                $isDuplicateRequest = $this->isDuplicateRequest($existingOrder, $request);

                if ($isDuplicateRequest) {
                    // Return existing order for duplicate requests
                    $paymentGateway = PaymentGatewayFactory::make($existingOrder->currency);

                    if ($existingOrder->payment_status !== 'pending') {
                        return response()->json([
                            'status' => $existingOrder->payment_status,
                            'message' => 'Payment already processed',
                            'payment_status' => $existingOrder->payment_status,
                            'order_id' => $existingOrder->order_id
                        ], 200);
                    }

                    return response()->json([
                        'paymentUrl' => $existingOrder->metadata['payment_url'] ?? null,
                        'reference' => $existingOrder->payment_reference,
                        'provider' => $existingOrder->payment_gateway
                    ], 200);
                } else {
                    // Parameters changed, delete old order and create new one
                    Log::info('Order parameters changed, recreating order', [
                        'idempotency_key' => $idempotencyKey,
                        'old_currency' => $existingOrder->currency,
                        'new_currency' => $customerCurrency,
                        'old_amount' => $existingOrder->amount,
                        'new_amount' => $request->totalPrice
                    ]);

                    $existingOrder->delete();
                }
            }

            // Validate purchase
            $validation = $this->purchaseValidationService->validatePurchase($request->items, $request->email);

            if (!$validation['valid']) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validation['message']
                ], 403);
            }

            DB::beginTransaction();

            $cartItems = $request->items;

            // Get first product to identify store and creator
            $firstProduct = Product::where('product_id', $cartItems[0]['product_id'])
                ->with(['user.store'])
                ->firstOrFail();

            $store = $firstProduct->user->store;
            $creatorId = $firstProduct->user_id;

            // Generate callback URL
            $callbackUrl = $this->generateCallbackUrl($store, $request->header('Origin'));

            // Calculate totals
            $totalAmountCustomerCurrency = 0;
            $totalAmountNGN = 0;
            $orderProducts = [];
            $orderItems = [];

            foreach ($cartItems as $item) {
                $product = Product::where('product_id', $item['product_id'])
                    ->with(['user'])
                    ->firstOrFail();

                // Validate that all products belong to the same creator
                if ($product->user_id !== $creatorId) {
                    throw new \Exception('All products must be from the same store');
                }

                $itemTotalCustomerCurrency = $item['price'] * $item['quantity'];
                $itemTotalNGN = $product->price * $item['quantity'];

                $totalAmountCustomerCurrency += $itemTotalCustomerCurrency;
                $totalAmountNGN += $itemTotalNGN;

                $orderProducts[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'seller' => [
                        'name' => $product->user->name,
                        'email' => $product->user->email,
                        'subdomain' => $product->user->store->subdomain
                    ]
                ];

                $orderItems[] = [
                    'product_id' => $product->id,
                    'seller_id' => $product->user_id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'unit_price_ngn' => $product->price,
                    'total_price' => $itemTotalCustomerCurrency,
                    'total_price_ngn' => $itemTotalNGN,
                    'currency' => $item['currency']
                ];
            }

            // Apply coupon discount
            $finalAmountCustomerCurrency = max(0.01, $totalAmountCustomerCurrency - $discountAmount);
            $finalAmountNGN = max(0.01, $totalAmountNGN - ($discountAmount * ($totalAmountNGN / $totalAmountCustomerCurrency)));

            // Prevent zero or negative amounts
            if ($finalAmountCustomerCurrency <= 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid discount amount - total cannot be zero or negative'
                ], 400);
            }

            Log::info('Order calculation', [
                'original_amount' => $totalAmountCustomerCurrency,
                'discount_amount' => $discountAmount,
                'final_amount' => $finalAmountCustomerCurrency,
                'currency' => $customerCurrency,
                'coupon_code' => $couponCode
            ]);

            // Create order
            $order = Order::create([
                'order_id' => 'ORD_' . Str::random(10),
                'user_id' => $user->id ?? null,
                'amount' => $finalAmountCustomerCurrency, // Use discounted amount
                'amount_ngn' => $finalAmountNGN,
                'commission_amount' => $finalAmountNGN * 0.10,
                'seller_amount' => $finalAmountNGN * 0.90,
                'currency' => $customerCurrency,
                'payment_status' => 'pending',
                'customer_email' => $request->email,
                'payment_reference' => Str::random(20),
                'idempotency_key' => $idempotencyKey,
                'metadata' => [
                    'customer_details' => [
                        'firstName' => $request->firstName,
                        'lastName' => $request->lastName,
                        'phone' => $request->phone ?? null,
                        'country' => $request->country ?? null,
                    ],
                    'order_note' => $request->orderNote,
                    'products' => $orderProducts,
                    'coupon' => $couponCode ? [
                        'code' => $couponCode,
                        'discount_amount' => $discountAmount,
                        'original_amount' => $totalAmountCustomerCurrency,
                        'final_amount' => $finalAmountCustomerCurrency
                    ] : null,
                    'currency_conversion' => [
                        'customer_currency' => $customerCurrency,
                        'ngn_rate' => $totalAmountNGN / $totalAmountCustomerCurrency
                    ]
                ]
            ]);

            // Create order items
            foreach ($orderItems as $itemData) {
                $commission = $itemData['total_price_ngn'] * 0.10;
                $sellerAmount = $itemData['total_price_ngn'] - $commission;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'seller_id' => $itemData['seller_id'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'unit_price_ngn' => $itemData['unit_price_ngn'],
                    'total_price' => $itemData['total_price'],
                    'total_price_ngn' => $itemData['total_price_ngn'],
                    'commission_amount' => $commission,
                    'seller_amount' => $sellerAmount,
                    'currency' => $itemData['currency']
                ]);
            }

            // Initialize payment with DISCOUNTED amount
            $paymentGateway = PaymentGatewayFactory::make($customerCurrency);

            // Use the DISCOUNTED amount for payment gateway
            $paymentAmount = $customerCurrency === 'NGN' ? $finalAmountCustomerCurrency * 100 : $finalAmountCustomerCurrency;

            Log::info('Payment gateway initialization', [
                'original_amount' => $totalAmountCustomerCurrency,
                'discounted_amount' => $finalAmountCustomerCurrency,
                'payment_amount' => $paymentAmount,
                'currency' => $customerCurrency,
                'coupon_applied' => $couponCode ? true : false
            ]);

            $paymentData = $paymentGateway->initializeTransaction([
                'product_name' => $firstProduct->name,
                'email' => $request->email,
                'amount' => $paymentAmount, // This is now the discounted amount
                'currency' => $customerCurrency,
                'reference' => $order->payment_reference,
                'callback_url' => $callbackUrl,
                'metadata' => [
                    'order_id' => $order->id,
                    'customer_name' => $request->firstName . ' ' . $request->lastName,
                    'items_count' => count($cartItems),
                    'coupon_code' => $couponCode,
                    'discount_amount' => $discountAmount,
                    'original_amount' => $totalAmountCustomerCurrency,
                    'final_amount' => $finalAmountCustomerCurrency
                ],
                'narration' => $firstProduct->name
            ]);

            // Update order with payment gateway info
            $order->update([
                'payment_gateway' => class_basename($paymentGateway),
                'provider_reference' => $paymentData['session_id'] ?? $paymentData['transaction_id'] ?? $paymentData['depositId'] ?? null,
                'metadata' => array_merge($order->metadata, ['payment_url' => $paymentData['payment_url']])
            ]);

            DB::commit();

            Log::info('Order created successfully', [
                'order_id' => $order->order_id,
                'final_amount' => $finalAmountCustomerCurrency,
                'currency' => $customerCurrency,
                'idempotency_key' => $idempotencyKey,
                'coupon_applied' => $couponCode ? true : false
            ]);

            return response()->json([
                'paymentUrl' => $paymentData['payment_url'],
                'reference' => $order->payment_reference,
                'provider' => get_class($paymentGateway)
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error initiating payment: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error initiating payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function verify(string $reference)
    {
        try {
            return DB::transaction(function () use ($reference) {
                $order = Order::where('payment_reference', $reference)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($order->payment_status === 'success') {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Payment already verified',
                        'order' => $order->fresh()->load('items.product')
                    ]);
                }

                $paymentGateway = PaymentGatewayFactory::make($order->currency);
                $verificationReference = $order->provider_reference ?? $order->payment_reference;

                try {
                    $verification = $paymentGateway->verifyTransaction($verificationReference);
                } catch (\Exception $e) {
                    Log::error('Payment gateway verification failed', [
                        'reference' => $verificationReference,
                        'error' => $e->getMessage()
                    ]);
                    throw $e;
                }
                return $this->processVerificationResult($order, $verification);
            }, 5);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Payment verification failed', [
                'reference' => $reference,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Error verifying payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function download(Request $request, string $order_id)
    {
        try {

            $order = Order::where('order_id', $order_id)
                ->with(['items.product'])
                ->firstOrFail();

            if ($order->payment_status !== 'success') {
                return response()->json([
                    'message' => 'Payment not verified',
                ], 403);
            }

            if ($order->items->where('status', 'failed')->count() > 0) {
                return response()->json([
                    'message' => 'One or more items failed to download',
                ], 403);
            }

            // Get all downloadable items from this order
            $downloads = $this->generateDownloadUrls($order);



            return response()->json([
                'order_id' => $order->order_id,
                'downloads' => $downloads
            ]);
        } catch (\Exception $e) {
            Log::error('Download error', [
                'order_id' => $order_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to process download request',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function emailDownloadUrl(Request $request, string $order_id)
    {
        try {
            if (!$request->hasValidSignature()) {
                return response()->json([
                    'message' => 'Invalid or expired download link'
                ], 403);
            }

            $order = Order::where('order_id', $order_id)
                ->with(['items.product'])
                ->firstOrFail();

            // if ($order->items->count() === 1) {
            //     $item = $order->items->first();

            //     // Clean the path
            //     $path = str_replace(
            //         env('DO_SPACES_ENDPOINT') . '/' . env('DO_SPACES_BUCKET') . '/',
            //         '',
            //         $item->product->product_file
            //     );

            //     // Get S3 client
            //     $s3Client = new S3Client([
            //         'version' => 'latest',
            //         'region'  => env('DO_SPACES_REGION'),
            //         'endpoint' => env('DO_SPACES_ENDPOINT'),
            //         'credentials' => [
            //             'key'    => env('DO_SPACES_KEY'),
            //             'secret' => env('DO_SPACES_SECRET'),
            //         ],
            //         'use_path_style_endpoint' => true
            //     ]);

            //     try {
            //         $result = $s3Client->getObject([
            //             'Bucket' => env('DO_SPACES_BUCKET'),
            //             'Key'    => $path
            //         ]);


            //         $item->markAsDownloaded();

            //         return new StreamedResponse(
            //             function () use ($result) {
            //                 while (!$result['Body']->eof()) {
            //                     echo $result['Body']->read(1024);
            //                 }
            //             },
            //             200,
            //             [
            //                 'Content-Type' => $result['ContentType'],
            //                 'Content-Disposition' => 'attachment; filename="' . basename($path) . '"',
            //                 'Content-Length' => $result['ContentLength'],
            //                 'Cache-Control' => 'no-cache, private'
            //             ]
            //         );
            //     } catch (AwsException $e) {
            //         Log::error('Failed to download file', [
            //             'order_id' => $order_id,
            //             'error' => $e->getMessage()
            //         ]);

            //         $item->update(['status' => 'failed']);

            //         return response()->json([
            //             'message' => 'Failed to download file'
            //         ], 500);
            //     }
            // }

            //Generate download urls
            $downloads = $this->generateDownloadUrls($order);

            // For multiple files, return download links
            return view('orders.downloads', [
                'order' => $order,
                'downloads' => $downloads
            ]);
        } catch (\Exception $e) {
            Log::error('Download error', [
                'order_id' => $order_id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'message' => 'Failed to process download request'
            ], 500);
        }
    }

    private function processVerificationResult(Order $order, array $verification)
    {
        switch ($verification['status']) {
            case 'successful':
            case 'success':
                $order->update([
                    'payment_status' => 'success',
                    'metadata' => array_merge($order->metadata ?? [], [
                        'payment_details' => $verification,
                        'verified_at' => now()
                    ])
                ]);

                $order->refresh();

                event(new OrderCompleted($order));

                return response()->json([
                    'status' => 'success',
                    'message' => 'Payment verified successfully',
                    'order' => $order->load('items.product')
                ]);

            case 'processing':
                return response()->json([
                    'status' => 'processing',
                    'message' => 'Payment is processing',
                    'order' => $order->load('items.product')
                ]);

            case 'cancelled':
                $order->update([
                    'payment_status' => 'cancelled',
                    'metadata' => array_merge($order->metadata ?? [], [
                        'cancelled_at' => now()
                    ])
                ]);

                return response()->json([
                    'status' => 'cancelled',
                    'message' => 'Payment was cancelled'
                ]);


            default:
                $order->update([
                    'payment_status' => 'failed',
                    'metadata' => array_merge($order->metadata ?? [], [
                        'failed_at' => now()
                    ])
                ]);

                return response()->json([
                    'status' => 'failed',
                    'message' => 'Payment verification failed'
                ], 400);
        }
    }

    private function generateDownloadUrls($order)
    {
        $s3Client = new S3Client([
            'version' => 'latest',
            'region' => env('DO_SPACES_REGION'),
            'endpoint' => env('DO_SPACES_URL'),
            'credentials' => [
                'key' => env('DO_SPACES_KEY'),
                'secret' => env('DO_SPACES_SECRET'),
            ],
            'use_path_style_endpoint' => true,
        ]);

        return $order->items->map(function ($item) use ($s3Client) {
            try {

                $path = str_replace(env('DO_SPACES_URL') . '/', '', $item->product->product_file);

                $command = $s3Client->getCommand('GetObject', [
                    'Bucket' => env('DO_SPACES_BUCKET'),
                    'Key' => $path,
                    'ResponseContentDisposition' => 'attachment; filename="' . basename($path) . '"',
                ]);

                $presignedUrl = $s3Client->createPresignedRequest($command, '+7 days')->getUri();

                $item->markAsDownloaded();

                $productType = str_replace('_', ' ', $item->product->product_type->value);

                return [
                    'product_name' => $item->product->name,
                    'download_url' => $presignedUrl,
                    'product_type' => $productType,
                    'file_name' => basename($path),
                    'expires_in' => '7 days'
                ];
            } catch (AwsException $e) {
                Log::error('Failed to generate download URL', [
                    'item_id' => $item->id,
                    'error' => $e->getMessage()
                ]);

                $item->update(['status' => 'failed']);

                return [
                    'product_name' => $item->product->name,
                    'error' => 'Failed to generate download URL'
                ];
            }
        });
    }

    private function generateCallbackUrl($store, $origin)
    {
        $protocol = app()->environment('local') ? 'http' : 'https';
        $siteUrl = env("FRONTEND_DOMAIN");

        // If origin is a custom domain
        if ($store->custom_domain && $origin === "{$protocol}://{$store->custom_domain}") {
            return "{$protocol}://{$store->custom_domain}/payment/success";
        }
        // If origin is a subdomain
        else if (str_ends_with($origin, $siteUrl)) {
            return "{$protocol}://{$store->subdomain}.{$siteUrl}/payment/success";
        }
        // If origin is localhost
        else if (str_contains($origin, 'localhost:3000')) {
            return "http://{$store->subdomain}.localhost:3000/payment/success";
        }
        // Fallback to store's primary domain
        else {
            return $store->custom_domain && $store->custom_domain_status === 'verified'
                ? "{$protocol}://{$store->custom_domain}/payment/success"
                : "{$protocol}://{$store->subdomain}.{$siteUrl}/payment/success";
        }
    }

    private function isDuplicateRequest(Order $existingOrder, Request $request): bool
    {
        $customerCurrency = $request->items[0]['currency'];
        $discountAmount = $request->discount_amount ?? 0;
        $couponCode = $request->coupon_code;

        // Check currency match
        if ($existingOrder->currency !== $customerCurrency) {
            return false;
        }

        // Check coupon match
        $existingCouponCode = $existingOrder->metadata['coupon']['code'] ?? null;
        if ($existingCouponCode !== $couponCode) {
            return false;
        }

        // Check discount amount match
        $existingDiscount = $existingOrder->metadata['coupon']['discount_amount'] ?? 0;
        if (abs($existingDiscount - $discountAmount) > 0.01) {
            return false;
        }

        // Check if items are the same (simplified check)
        $existingItemsCount = count($existingOrder->metadata['products'] ?? []);
        $currentItemsCount = count($request->items);

        if ($existingItemsCount !== $currentItemsCount) {
            return false;
        }

        // Check total amount match (this should be the final check)
        $currentTotal = $request->totalPrice;
        if (abs($existingOrder->amount - $currentTotal) > 0.01) {
            return false;
        }

        return true;
    }
}
