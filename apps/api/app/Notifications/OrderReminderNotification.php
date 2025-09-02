<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Order;
use App\Helpers\UrlHelper;
use Illuminate\Support\Facades\Log;

class OrderReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Order $order)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $totalItems = $this->order->items->count();
        $itemWord = $totalItems === 1 ? 'item' : 'items';

        $storeSubdomain = $this->getStoreSubdomain();

        $checkoutUrl = UrlHelper::getStoreUrl($storeSubdomain, 'checkout');

        Log::info('Sending order reminder email', [
            'checkoutUrl' => $checkoutUrl
        ]);

        return (new MailMessage)
            ->subject("Complete Your Purchase of {$totalItems} {$itemWord} on " . config('app.name'))
            ->markdown('emails.orders.reminder', [
                'order' => $this->order,
                'items' => $this->order->items->load('product'),
                'checkoutUrl' => $checkoutUrl
            ]);
    }

    private function getStoreSubdomain(): string
    {
        if (isset($this->order->metadata['subdomain'])) {
            return $this->order->metadata['subdomain'];
        }

        if (isset($this->order->metadata['products']) && is_array($this->order->metadata['products']) && !empty($this->order->metadata['products'])) {
            // Get the first product
            $firstProduct = $this->order->metadata['products'][0];

            // Check if this product has seller info with a subdomain
            if (isset($firstProduct['seller']['subdomain'])) {
                $subdomain = $firstProduct['seller']['subdomain'];
                return $subdomain;
            }
        }

        if ($this->order->user && $this->order->user->store) {
            return $this->order->user->store->subdomain;
        }

        return 'store';
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
