<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Payout;

class PayoutProcessed extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Payout $payout) {}

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
        return (new MailMessage)
            ->subject('Your Payout Has Been Processed')
            ->greeting('Hello ' . $notifiable->username . '!')
            ->line('We have processed your payout of ' . number_format($this->payout->amount, 2) . ' ' . $this->payout->currency . '.')
            ->line('The funds have been sent to your bank account ending in ' . substr($this->payout->bank_account_number, -4) . '.')
            ->line('Transaction Reference: ' . $this->payout->reference)
            ->line('This payout includes your earnings from sales up to ' . $this->payout->created_at->format('F j, Y') . '.')
            ->line('Thank you for using our platform!');
    }
}
