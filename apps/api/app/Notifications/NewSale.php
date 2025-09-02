<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Order;
use Illuminate\Support\Collection;
use Illuminate\Notifications\Messages\BroadcastMessage;

class NewSale extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Order $order, public Collection $items, public string $subdomain)
    {
        $this->items = $items->load(['product']);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Sale on ' . ucfirst($this->subdomain))
            ->markdown('emails.notifications.new-sale', [
                'order' => $this->order,
                'items' => $this->items,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'amount' => $this->order->amount_ngn,
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product?->name ?? 'Product',
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'seller_amount' => $item->seller_amount,
                ];
            }),
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'order_id' => $this->order->id,
            'amount' => $this->order->amount_ngn,
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product?->name ?? 'Product',
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'seller_amount' => $item->seller_amount,
                ];
            }),
        ]);
    }
}
