<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Events\OrderCompleted;
use Stripe\Webhook as StripeWebhook;
use Stripe\Exception\SignatureVerificationException;

class WebhookController extends Controller
{
    public function handlePaystackWebhook(Request $request)
    {
        try {
            // Only process POST requests with Paystack signature
            if ($request->method() !== 'POST' || !$request->hasHeader('x-paystack-signature')) {
                throw new \Exception('Invalid request method or missing signature');
            }

            // Get the raw request body
            $input = $request->getContent();

            // Get Paystack signature from header
            $paystackSignature = $request->header('x-paystack-signature');

            // Get Paystack secret key
            $paystackSecret = config('services.paystack.secret_key');

            // Validate signature
            if ($paystackSignature !== hash_hmac('sha512', $input, $paystackSecret)) {
                throw new \Exception('Invalid signature');
            }

            // Parse the JSON payload
            $payload = json_decode($input, true);

            // Log the payload for debugging
            Log::info('Paystack Webhook Payload', [
                'event' => $payload['event'] ?? 'no_event',
                'signature' => $paystackSignature,
                'payload' => $payload
            ]);

            // Handle the event
            if ($payload['event'] === 'charge.success') {
                $reference = $payload['data']['reference'];
                $order = Order::where('payment_reference', $reference)->lockForUpdate()->first();

                if (!$order) {
                    Log::error('Order not found for Paystack webhook', ['reference' => $reference]);
                    return response()->json(['message' => 'Order not found'], 404);
                }

                if ($order->payment_status !== 'success') {
                    $order->update([
                        'payment_status' => 'success',
                        'metadata' => array_merge($order->metadata ?? [], [
                            'payment_details' => [
                                'status' => 'success',
                                'amount' => $payload['data']['amount'] / 100,
                                'currency' => $payload['data']['currency'],
                                'provider_reference' => $payload['data']['id'],
                                'payment_date' => now(),
                                'webhook_processed' => true,
                                'webhook_source' => 'paystack',
                                'webhook_processed_at' => now(),
                            ]
                        ])
                    ]);

                    Log::info('Order payment status updated to success via webhook', [
                        'order_id' => $order->order_id,
                        'reference' => $reference
                    ]);
                }

                if (!$order->email_sent) {
                    event(new OrderCompleted($order));

                    Log::info('OrderCompleted event fired from webhook', [
                        'order_id' => $order->order_id,
                        'reference' => $reference
                    ]);
                }
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Paystack Webhook Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'headers' => $request->headers->all(),
                'input' => $request->getContent()
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleFlutterwaveWebhook(Request $request)
    {
        try {

            $secretHash = config('services.flutterwave.webhook_secret');

            // Verify Flutterwave webhook signature
            $signature = $request->header('verif-hash');
            if (!$signature || $signature !== $secretHash) {
                throw new \Exception('Invalid signature');
            }

            $input = $request->getContent();
            $payload = json_decode($input, true);
            Log::info('Flutterwave Webhook Payload', ['payload' => $payload]);

            // if ($payload['event.type'] === 'charge.completed' && $payload['data']['status'] === 'successful') {
            //     $reference = $payload['data']['tx_ref'];
            //     $order = Order::where('payment_reference', $reference)->first();

            //     if (!$order) {
            //         Log::error('Order not found for Flutterwave webhook', ['reference' => $reference]);
            //         return response()->json(['message' => 'Order not found'], 404);
            //     }

            //     if ($order->payment_status !== 'success') {
            //         $order->update([
            //             'payment_status' => 'success',
            //             'metadata' => array_merge($order->metadata ?? [], [
            //                 'payment_details' => [
            //                     'status' => 'success',
            //                     'amount' => $payload['data']['amount'],
            //                     'currency' => $payload['data']['currency'],
            //                     'provider_reference' => $payload['data']['id'],
            //                 ]
            //             ])
            //         ]);

            //         event(new OrderCompleted($order));
            //     }
            // }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Flutterwave Webhook Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'headers' => $request->headers->all(),
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleStripeWebhook(Request $request)
    {
        try {
            $sigHeader = $request->header('stripe-signature');
            $stripeWebhookSecret = config('services.stripe.webhook_secret');
            try {
                $event = StripeWebhook::constructEvent(
                    $request->getContent(),
                    $sigHeader,
                    $stripeWebhookSecret
                );
            } catch (SignatureVerificationException $e) {
                throw new \Exception('Invalid signature');
            }

            Log::info('Stripe Webhook Event', ['event' => $event]);

            //i am usingg checkout session
            if ($event->type === 'checkout.session.completed') {
                $session = $event->data->object;
                //reference is the session id
                $reference = $session->id;
                if (!$reference) {
                    throw new \Exception('Payment reference not found');
                }

                $order = Order::where('provider_reference', $reference)->first();

                if (!$order) {
                    Log::error('Order not found for Stripe webhook', ['reference' => $reference]);
                    return response()->json(['message' => 'Order not found'], 404);
                }

                if ($order->payment_status !== 'success') {
                    $order->update([
                        'payment_status' => 'success',
                        'metadata' => array_merge($order->metadata ?? [], [
                            'payment_details' => [
                                'status' => 'success',
                                'amount' => $session->amount_total / 100,
                                'currency' => strtoupper($session->currency),
                                'customer' => [
                                    'email' => $session->customer_details->email,
                                    'name' => $session->customer_details->name
                                ],

                            ]
                        ])
                    ]);

                    event(new OrderCompleted($order));
                }
            }
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Stripe Webhook Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'headers' => $request->headers->all(),
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleKoraWebhook(Request $request)
    {
        try {
            //log request headers
            Log::info('Kora Webhook Request Headers', $request->headers->all());
            // Only process POST requests with Kora signature
            if ($request->method() !== 'POST' || !$request->hasHeader('x-korapay-signature')) {
                throw new \Exception('Invalid request method or missing signature');
            }
            // Get the raw request body
            $input = $request->getContent();

            $payload = json_decode($input, true);

            // Get Paystack signature from header
            $koraSignature = $request->header('x-korapay-signature');

            // Get Paystack secret key
            $koraSecret = config('services.kora.secret_key');

            $dataString = json_encode($payload['data'], JSON_UNESCAPED_SLASHES);
            $computedSignature = hash_hmac('sha256', $dataString, $koraSecret);

            // Validate signature
            if ($koraSignature !== $computedSignature) {
                throw new \Exception('Invalid signature');
            }


            // Log the payload for debugging
            Log::info('Kora Webhook Payload', [
                'event' => $payload['event'] ?? 'no_event',
                'signature' => $koraSignature,
                'payload' => $payload
            ]);
            // Handle the event
            if ($payload['event'] === 'charge.success') {
                $reference = $payload['data']['reference'];
                $order = Order::where('payment_reference', $reference)->first();

                if (!$order) {
                    Log::error('Order not found for Kora webhook', ['reference' => $reference]);
                    return response()->json(['message' => 'Order not found'], 404);
                }

                if ($order->payment_status !== 'success') {
                    $order->update([
                        'payment_status' => 'success',
                        'metadata' => array_merge($order->metadata ?? [], [
                            'payment_details' => [
                                'status' => 'success',
                                'amount' => $payload['data']['amount'] / 100,
                                'currency' => $payload['data']['currency'],
                                // 'provider_reference' => $payload['data']['id'],
                                'payment_date' => now(),
                                'webhook_processed' => true,
                                'webhook_source' => 'kora',
                                'webhook_processed_at' => now(),
                            ]
                        ])
                    ]);

                    Log::info('Order payment status updated to success via webhook', [
                        'order_id' => $order->order_id,
                        'reference' => $reference
                    ]);
                }

                if (!$order->email_sent) {
                    event(new OrderCompleted($order));

                    Log::info('OrderCompleted event fired from webhook', [
                        'order_id' => $order->order_id,
                        'reference' => $reference
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Kora Webhook Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    public function handlePawapayWebhook(Request $request)
    {
        try {
            Log::info('Pawapay Webhook Request Headers', $request->headers->all());
            Log::info('Pawapay Webhook Request', $request->all());

            if ($request->method() !== 'POST') {
                throw new \Exception('Invalid request method');
            }

            $input = $request->getContent();
            $payload = json_decode($input, true);

            if (!$payload) {
                throw new \Exception('Invalid JSON payload');
            }

            if ($payload['status'] === 'COMPLETED') {
                $reference = $payload['depositId'];
                $order = Order::where('provider_reference', $reference)->first();

                if (!$order) {
                    Log::error('Order not found for Pawapay webhook', ['reference' => $reference]);
                    return response()->json(['message' => 'Order not found'], 404);
                }

                if ($order->payment_status !== 'success') {
                    $order->update([
                        'payment_status' => 'success',
                        'metadata' => array_merge($order->metadata ?? [], [
                            'payment_details' => [
                                'status' => 'success',
                                'amount' => $payload['depositedAmount'],
                                'currency' => $payload['currency'],
                                'provider_reference' => $payload['depositId'],
                                'payment_date' => now(),
                                'webhook_processed' => true,
                                'webhook_source' => 'pawapay',
                                'webhook_processed_at' => now(),
                            ]
                        ])
                    ]);
                }

                if (!$order->email_sent) {
                    event(new OrderCompleted($order));
                }
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            Log::error('Pawapay Webhook Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
