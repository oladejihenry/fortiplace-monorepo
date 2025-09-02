<?php

namespace App\Services;

use App\Services\PaymentGateway\PaymentGatewayInterface;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class StripeService implements PaymentGatewayInterface
{
    private const SUPPORTED_CURRENCIES = ['USD', 'GBP'];


    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret_key'));
    }



    public function getSupportedCurrencies(): array
    {
        return self::SUPPORTED_CURRENCIES;
    }

    public function initializeTransaction(array $data): array
    {
        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => strtolower($data['currency']),
                        'product_data' => [
                            'name' => $data['product_name'],
                        ],
                        'unit_amount' => (int)($data['amount'] * 100), // Convert to cents
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $data['callback_url'] . '?session_id={CHECKOUT_SESSION_ID}&reference=' . $data['reference'],
                'cancel_url' => $data['callback_url'] . '?status=cancelled&reference=' . $data['reference'],
                'client_reference_id' => $data['reference'],
                'invoice_creation' => [
                    'enabled' => true
                ],
                'metadata' => [
                    'order_id' => $data['metadata']['order_id'],
                    'customer_name' => $data['metadata']['customer_name'],
                    'items_count' => $data['metadata']['items_count'],
                ],
                'customer_email' => $data['email'],
            ]);

            return [
                'status' => true,
                'session_id' => $session->id,
                'payment_url' => $session->url,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to initialize transaction: ' . $e->getMessage());
        }
    }

    public function verifyTransaction(string $reference): array
    {
        try {
            $session = Session::retrieve($reference);

            $status = match ($session->payment_status) {
                'paid' => 'successful',
                'unpaid' => 'failed',
                default => 'failed'
            };

            return [
                'status' => $status,
                'amount' => $session->amount_total / 100,
                'currency' => strtoupper($session->currency),
                'customer' => [
                    'email' => $session->customer_details->email,
                    'name' => $session->customer_details->name
                ],
                'meta' => $session->metadata->toArray(),
                'payment_type' => 'card',
                'created_at' => date('Y-m-d H:i:s', $session->created)
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to verify transaction: ' . $e->getMessage());
        }
    }
}
