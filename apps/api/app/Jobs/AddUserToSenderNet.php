<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\SenderNetService;
use Illuminate\Support\Facades\Log;

class AddUserToSenderNet implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $email;
    public $groupId;
    public $username;
    /**
     * Create a new job instance.
     */
    public function __construct($email, $groupId, $username)
    {
        $this->email = $email;
        $this->groupId = $groupId;
        $this->username = $username;
    }

    /**
     * Execute the job.
     */
    public function handle(SenderNetService $senderNetService): void
    {
        try {
            $senderNetService->createSubscriber($this->email, $this->groupId, $this->username);
            $senderNetService->addSubscriberToGroup($this->groupId, [$this->email]);
        } catch (\Exception $e) {
            Log::error('Failed to add user to Sender.net group', ['error' => $e->getMessage()]);
        }
    }
}
