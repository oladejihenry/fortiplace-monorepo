<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Events\OrderCompleted;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmation;
use App\Notifications\NewSale;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use App\Services\CustomerAccountService;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendCustomerCredentials;

class SendOrderConfirmation implements ShouldBeUnique
{
    use InteractsWithQueue;

    public $tries = 3;

    public $backoff = 60;

    /**
     * Create the event listener.
     */
    public function __construct(
        private CustomerAccountService $customerAccountService
    ) {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCompleted $event): void
    {
        try {
            $order = $event->order;

            if ($order->email_sent) {
                return;
            }

            if ($order->payment_status !== 'success') {
                Log::warning('Skipping email for non-successful payment', [
                    'order_id' => $order->order_id,
                    'status' => $order->payment_status
                ]);
                return;
            }

            $this->handleSuccessfulPayment($order);

            Mail::to($order->customer_email)
                ->send(new OrderConfirmation($order));


            // Notify seller about the sale
            $sellerOrders = $order->items->load(['product', 'product.user.store'])->groupBy('seller_id');

            foreach ($sellerOrders as $sellerId => $items) {
                $seller = $items->first()->product->user;
                //user subdomain
                $subdomain = $seller->store?->subdomain;
                if ($seller) {
                    $seller->notify(new NewSale($order, $items, $subdomain));
                }
            }

            $order->update(['email_sent' => true]);

            Log::info('Order confirmation email sent successfully', [
                'order_id' => $order->order_id,
                'customer_email' => $order->customer_email
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending order confirmation: ' . $e->getMessage());
        }
    }

    private function handleSuccessfulPayment($order)
    {
        Log::info('Handling successful payment', [
            'order_id' => $order->order_id,
            'user_id' => $order->user_id
        ]);

        try {
            if (!$order->user_id) {
                DB::transaction(function () use ($order) {
                    $accountDetails = $this->customerAccountService->createCustomerAccount($order);

                    Log::info('Account details', [
                        'account_details' => $accountDetails
                    ]);

                    if ($accountDetails['created']) {
                        Log::info('Dispatching customer credentials email', [
                            'user_id' => $accountDetails['user']->id,
                            'order_id' => $order->order_id,
                            'user_email' => $accountDetails['user']->email,
                            'password' => $accountDetails['password'],
                            'user' => $accountDetails['user']
                        ]);
                        SendCustomerCredentials::dispatch(
                            $accountDetails['user'],
                            $accountDetails['password'],
                            $order->order_id,
                            config('services.sender_net.normal_user_group_id')
                        )->onQueue('default')
                            ->delay(now()->addSeconds(5))->afterCommit();
                    }

                    Log::info('Successfully handled payment and created account', [
                        'order_id' => $order->order_id,
                        'user_id' => $accountDetails['user']->id,
                        'account_created' => $accountDetails['created']
                    ]);
                }, 3);
            }
        } catch (\Exception $e) {
            Log::error('Error handling successful payment', [
                'order_id' => $order->order_id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
