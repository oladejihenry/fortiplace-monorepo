<?php

namespace App\Services\PaymentGateway;

use App\Services\PaystackService;
use App\Services\FlutterwaveService;
use App\Services\StripeService;
use App\Services\KoraService;
use App\Services\PawapayService;

class PaymentGatewayFactory
{
    private const CURRENCY_GATEWAYS = [
        // 'NGN' => KoraService::class,
        'NGN' => PaystackService::class,
        'GBP' => StripeService::class,
        'USD' => StripeService::class,
        'GHS' => FlutterwaveService::class,
        'KES' => FlutterwaveService::class,
        'UGX' => FlutterwaveService::class,
        'ZAR' => FlutterwaveService::class,
        // 'XAF' => FlutterwaveService::class,
        'XAF' => PawapayService::class,
        // 'XOF' => FlutterwaveService::class,
    ];

    public static function make(string $currency): PaymentGatewayInterface
    {
        $currency = strtoupper($currency);
        $gatewayClass = self::CURRENCY_GATEWAYS[$currency] ?? FlutterwaveService::class;

        return app($gatewayClass);
    }
}
