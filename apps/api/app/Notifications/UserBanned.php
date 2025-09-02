<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserBanned extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $reason,
    ) {}

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
            ->subject('Your Account Has Been Banned')
            ->greeting('Hello ' . $notifiable->username . ',')
            ->line('We regret to inform you that your account has been suspended.')
            ->line('Reason: ' . $this->reason)
            ->line('As a result of this suspension:')
            ->line('• You will no longer be able to log in to your account')
            ->line('• Your store has been taken offline')
            ->line('• Any pending payouts will be held')
            ->line('If you believe this is in error, please contact our support team.')
            ->salutation('Regards, The Support Team');
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
