<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Promotion;
use App\Models\User;

class PromotionalEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        private Promotion $promotion,
        private User $user
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Promotional Email',
        );
    }

    public function build()
    {
        return $this->subject($this->promotion->subject)
            ->markdown('emails.promotions.promotional', [
                'content' => $this->promotion->content,
                'user' => $this->user,
                'unsubscribeUrl' => route('unsubscribe', [
                    'user' => $this->user->id,
                    'token' => encrypt($this->user->email)
                ])
            ]);
    }
}
