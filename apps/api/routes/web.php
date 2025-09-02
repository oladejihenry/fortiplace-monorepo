<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\TwitterAuthController;

Route::get('/', function () {
    return ['Fortiplace Platform API'];
});


Route::get('/orders/{order_id}/email-download-url', [OrderController::class, 'emailDownloadUrl'])
    ->name('orders.email-download-url')
    ->middleware('signed');


Route::prefix('auth/google')->group(function () {
    Route::get('url', [GoogleAuthController::class, 'redirectToGoogle']);
    Route::get('callback', [GoogleAuthController::class, 'handleGoogleCallback']);
});


Route::prefix('auth/twitter')->group(function () {
    Route::get('url', [TwitterAuthController::class, 'redirectToTwitter']);
    Route::get('callback', [TwitterAuthController::class, 'handleTwitterCallback']);
});


// Route::get('/rsa', function () {
//     $config = [
//         "private_key_bits" => 2048,
//         "private_key_type" => OPENSSL_KEYTYPE_RSA,
//     ];

//     $res = openssl_pkey_new($config);

//     // Extract private key
//     openssl_pkey_export($res, $privateKey);

//     // Extract public key
//     $publicKey = openssl_pkey_get_details($res)["key"];

//     file_put_contents("private_key.pem", $privateKey);
//     file_put_contents("public_key.pem", $publicKey);

//     return response()->json([
//         'private_key' => $privateKey,
//         'public_key' => $publicKey
//     ]);
// });

// Route::impersonate();


require __DIR__ . '/auth.php';
