<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $tries = 3;

    public $backoff = 60;

    /**
     * Create a new event instance.
     */
    public function __construct(public Order $order)
    {
        $this->order = $order->load(['items.product', 'items.product.user']);
        $this->order->refresh();
        // if ($this->order->email_sent) {

        //     return;
        // }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('orders.'),
            new Channel('orders.' . $this->order->id),
        ];
    }

    public function broadcastWith()
    {
        return [
            'order_id' => $this->order->order_id,
            'items' => $this->order->items->map(function ($item) {
                return [
                    'product_id' => $item->product->product_id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'total' => $item->total_price,
                ];
            }),
            'total_amount' => $this->order->amount,
            'currency' => $this->order->currency,
            'created_at' => $this->order->created_at->toISOString(),
            'customer_name' => $this->order->metadata['customer_details']['firstName'] ?? 'Valued Customer',
            'socket' => null
        ];
    }
}
