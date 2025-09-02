<?php

use App\Http\Controllers\Admin\{
    AdminOrderController,
    ImpersonationController,
    PaymentsController,
    UserController as AdminUserController,
    ProductController as AdminProductController,
    PromotionController
};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Resources\UserResource;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductUploadController;
use App\Http\Controllers\Store\StoreController;
use App\Http\Controllers\Store\StoreProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductRatingController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CustomDomainController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\ProductDownloadController;
use App\Http\Controllers\ProductPromptGeneratorController;
use App\Http\Controllers\Webhook\WebhookController;
use App\Http\Controllers\IntegrationController;
use App\Http\Controllers\Token\Auth\LoginController;
use App\Http\Controllers\Token\Auth\RegisterController;
use App\Models\User;
use Illuminate\Support\Facades\Log;


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', fn(Request $request) => new UserResource($request->user()));
    Route::put('/user/{user}', [UserController::class, 'update']);
    Route::put('/bank/bank-details', [UserController::class, 'updateBankDetails']);
    Route::get('/bank/bank-list', [UserController::class, 'getBankList']);
    //Admin only routes


    //Creator routes
    Route::apiResource('products', ProductController::class);
    //Publish product routes
    Route::patch('products/{product}/publish', [ProductController::class, 'publish']);

    //Draft routes
    Route::post('products/draft', [ProductController::class, 'createDraft']);
    Route::get('products/draft/{productId}', [ProductController::class, 'getDraft']);
    Route::put('products/draft/{productId}', [ProductController::class, 'updateDraft']);

    //Product Upload routes
    Route::post('uploads/product-file', [ProductUploadController::class, 'uploadProductFile']);
    Route::post('uploads/cover-image', [ProductUploadController::class, 'uploadCoverImage']);
    Route::delete('uploads/product-file', [ProductUploadController::class, 'deleteProductFile']);
    Route::delete('uploads/cover-image', [ProductUploadController::class, 'deleteCoverImage']);


    //Sales routes
    Route::prefix('sales')->group(function () {
        Route::get('/', [SalesController::class, 'sales']);
        Route::get('/stats', [SalesController::class, 'salesStats']);
        Route::get('/stats/{period}', [SalesController::class, 'salesStatsByPeriod']);
    });

    //Analytics routes
    Route::prefix('analytics')->group(function () {
        Route::get('/product/{productId}', [AnalyticsController::class, 'productStats']);
        Route::get('/store', [AnalyticsController::class, 'storeStats']);
    });

    //Payout routes
    Route::prefix('payouts')->group(function () {
        Route::get('/', [PayoutController::class, 'index']);
        Route::get('/{reference}', [PayoutController::class, 'show']);
    });

    //Customer routes
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index']);
    });

    //Product prompt generator routes
    Route::prefix('generate-product')->group(function () {
        Route::post('/', ProductPromptGeneratorController::class);
    });

    //Integration routes
    Route::prefix('integrations')->group(function () {
        Route::get('/', [IntegrationController::class, 'index']);
        Route::post('/', [IntegrationController::class, 'store']);
        Route::put('/{integration}', [IntegrationController::class, 'update']);
        Route::delete('/{integration}', [IntegrationController::class, 'destroy']);

        Route::post('/custom-domain', [CustomDomainController::class, 'store']);
        Route::get('/custom-domain/list', [CustomDomainController::class, 'list']);
        Route::get('/custom-domain/status', [CustomDomainController::class, 'status']);
        Route::delete('/custom-domain/{domain}', [CustomDomainController::class, 'remove']);
    });


    //customer order routes
    Route::prefix('customer-orders')->group(function () {
        Route::get('/', [CustomerOrderController::class, 'index']);
        Route::get('/{order}', [CustomerOrderController::class, 'show']);
        Route::post('upgrade-account', [CustomerOrderController::class, 'upgradeAccount']);
    });

    //Coupon routes
    Route::apiResource('coupons', CouponController::class);



    //Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        //User routes
        Route::apiResource('users', AdminUserController::class);

        //User Ban and unban routes
        Route::post('users/{user}/ban', [AdminUserController::class, 'ban']);
        Route::post('users/{user}/unban', [AdminUserController::class, 'unban']);

        //User disable payout routes
        Route::post('users/{user}/disable-payouts', [AdminUserController::class, 'disablePayout']);
        Route::post('users/{user}/enable-payouts', [AdminUserController::class, 'enablePayout']);

        //Product routes
        Route::apiResource('products', AdminProductController::class);

        //Update product status routes
        Route::put('products/{product}/status', [AdminProductController::class, 'updateStatus']);

        //Promotion routes
        Route::apiResource('promotions', PromotionController::class);

        //Order routes
        Route::get('order-stats', [AdminOrderController::class, 'getOrderStats']);
        Route::get('stores/{store}/monthly-stats', [AdminOrderController::class, 'getStoreMonthlyStats']);

        //Impersonate routes
        Route::post('impersonate/leave', [ImpersonationController::class, 'leave']);
        Route::post('impersonate/{user}', [ImpersonationController::class, 'start']);

        //Payments routes
        Route::get('payments/list', [PaymentsController::class, 'list']);
    });



    //Route Group for Subdomain
    Route::group(['prefix' => 'store'], function () {

        Route::get('/show/{domain}', [StoreController::class, 'showByDomain'])->withoutMiddleware(['auth:sanctum']);
        Route::get('/show/{domain}/products', [StoreProductController::class, 'indexByDomain'])->withoutMiddleware(['auth:sanctum']);
        Route::get('/show/{domain}/products/{product}', [StoreProductController::class, 'showByDomain'])->withoutMiddleware(['auth:sanctum']);
        Route::get('/show/{domain}/user', [StoreController::class, 'userByDomain'])->withoutMiddleware(['auth:sanctum']);


        Route::get('/{store}', [StoreController::class, 'show'])->withoutMiddleware(['auth:sanctum']);
        Route::apiResource('{store}/products', StoreProductController::class)
            ->names([
                'index' => 'store.products.index',
                'show' => 'store.products.show',
                'store' => 'store.products.store',
                'update' => 'store.products.update',
                'destroy' => 'store.products.destroy'
            ])
            ->withoutMiddleware(['auth:sanctum']);
        Route::get('{store}/user', [StoreController::class, 'user'])->withoutMiddleware(['auth:sanctum']);
    });

    Route::post('/logout', [LoginController::class, 'logout']);



    // Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    //     ->name('verification.send');

    // Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, 'verify'])
    //     ->middleware(['signed', 'throttle:6,1'])
    //     ->name('verification.verify');
});



//Product rating routes
Route::prefix('products')->group(function () {
    Route::post('{product}/rate', [ProductRatingController::class, 'rate']);
    Route::get('{product}/rating', [ProductRatingController::class, 'getUserRating']);
});

//Coupon Apply routes
Route::post('coupons/apply', [CouponController::class, 'applyCoupon']);

//Google Auth routes


//Order routes
Route::prefix('orders')->group(function () {
    Route::post('/', [OrderController::class, 'initiatePayment'])->middleware('throttle:initiate-payment');
    Route::get('/verify/{reference}', [OrderController::class, 'verify'])->name('payment.verify');
    Route::get('/{order_id}/download', [OrderController::class, 'download'])
        ->name('orders.download')
        ->middleware('signed'); // Add signed URL middleware

});

//Downlaod routes with token based 
Route::get('/downloads/verify', [ProductDownloadController::class, 'verifyToken'])
    ->name('downloads.verify');

Route::post('/downloads/resend-link', [ProductDownloadController::class, 'resendDownloadLink'])
    ->name('downloads.resend-link');

//Payment webhook routes
Route::post('webhooks/paystack', [WebhookController::class, 'handlePaystackWebhook']);
// Route::post('webhooks/flutterwave', [WebhookController::class, 'handleFlutterwaveWebhook']);
Route::post('webhooks/stripe', [WebhookController::class, 'handleStripeWebhook']);
Route::post('webhooks/kora', [WebhookController::class, 'handleKoraWebhook'])->name('webhooks.kora');
Route::post('webhooks/pawapay', [WebhookController::class, 'handlePawapayWebhook'])->name('webhooks.pawapay');

//Action route for downloading the file
Route::get('/downloads/{order_id}/{product_id}', [ProductDownloadController::class, 'download'])
    ->name('downloads.file');


Route::get('/unsubscribe/{user}/{token}', function (User $user, string $token) {
    try {
        if (decrypt($token) === $user->email) {
            $user->update(['promotional_emails_enabled' => false]);
            return view('unsubscribe.success');
        }
    } catch (\Exception $e) {
        Log::error('Invalid unsubscribe attempt', [
            'user_id' => $user->id,
            'token' => $token
        ]);
    }

    return view('unsubscribe.error');
})->name('unsubscribe');


Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'store']);


// Route::impersonate();
