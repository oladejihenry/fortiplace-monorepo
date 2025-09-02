<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Order;
use App\Notifications\OrderReminderNotification;
use Illuminate\Support\Facades\Log;

class SendOrderReminders extends Command
{
    protected $signature = 'orders:send-reminders';
    protected $description = 'Send reminder emails for incomplete orders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $twoWeeksAgo = Carbon::now()->subWeeks(2);

        //5 mins ago
        $fiveMinsAgo = Carbon::now()->subMinutes(5);

        Log::info('Sending order reminders', [
            'twoWeeksAgo' => $twoWeeksAgo->toDateTimeString(),
            'fiveMinsAgo' => $fiveMinsAgo->toDateTimeString()
        ]);

        //Get incomplete orders
        $incompleteOrders = Order::query()
            ->where('payment_status', 'pending')
            ->where('reminder_count', '<', 3)
            ->where(function ($query) use ($fiveMinsAgo) {
                $query->whereNull('reminder_sent_at')
                    ->orWhere('reminder_sent_at', '<=', $fiveMinsAgo);
            })
            ->with(['items.product'])
            ->get();


        Log::info('Found ' . $incompleteOrders->count() . ' incomplete orders to send reminders for');

        $count = 0;

        foreach ($incompleteOrders as $order) {
            try {
                if (!$order->customer_email) {
                    $this->error("Order {$order->id} has no customer email. Skipping...");
                    continue;
                }

                // Check if customer has already purchased any of the products in this order
                $hasAlreadyPurchased = $this->hasCustomerPurchasedProducts(
                    $order->customer_email,
                    $order->items->pluck('product_id')->toArray(),
                    $order->id
                );

                if ($hasAlreadyPurchased) {
                    // Mark this order as abandoned since customer bought elsewhere
                    $order->update([
                        'payment_status' => 'abandoned',
                        'metadata' => array_merge($order->metadata ?? [], [
                            'abandoned_reason' => 'Customer purchased in another order'
                        ])
                    ]);
                    continue;
                }

                $now = Carbon::now();
                $orderAge = $order->created_at->diffInMinutes($now);

                if (
                    ($order->reminder_count === 0 && $orderAge >= 5) || // 5 mins for first reminder
                    ($order->reminder_count === 1 && $orderAge >= 24 * 60) || // 24 hours for second reminder
                    ($order->reminder_count === 2 && $orderAge >= 3 * 24 * 60) // 3 days for final reminder
                ) {
                    // Send Reminder
                    $order->notify(new OrderReminderNotification($order));

                    // Update reminder tracking
                    $order->increment('reminder_count');
                    $order->reminder_sent_at = now();
                    $order->save();

                    $count++;
                } else {
                    Log::info('Skipping reminder. Not time yet.', [
                        'order_id' => $order->order_id,
                        'reminder_count' => $order->reminder_count,
                        'order_age_minutes' => $orderAge
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to send order reminder', [
                    'order_id' => $order->order_id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        $this->info("Sent {$count} order reminder emails.");
    }

    private function hasCustomerPurchasedProducts(string $customerEmail, array $productIds, string $excludeOrderId): bool
    {
        return Order::where('customer_email', $customerEmail)
            ->where('id', '!=', $excludeOrderId)
            ->where('payment_status', 'success')
            ->whereHas('items', function ($query) use ($productIds) {
                $query->whereIn('product_id', $productIds);
            })
            ->exists();
    }
}
