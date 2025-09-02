<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class CustomerAccountCreated extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $password;
    public string $orderId;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $password, string $orderId)
    {
        $this->user = $user;
        $this->password = $password;
        $this->orderId = $orderId;
    }


    public function build()
    {
        return $this->markdown('emails.customer-account-created')
            ->subject('Your Fortiplace Account Details');
    }
}
