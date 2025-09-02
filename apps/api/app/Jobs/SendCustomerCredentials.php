<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\CustomerAccountCreated;
use Illuminate\Support\Facades\Log;
use App\Services\SenderNetService;

class SendCustomerCredentials implements ShouldQueue
{
    use Queueable, InteractsWithQueue, Queueable, SerializesModels;

    private User $user;
    private string $password;
    private string $orderId;
    private string $groupId;

    public $tries = 3;
    public $timeout = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(User $user, string $password, string $orderId, string $groupId)
    {
        $this->user = $user;
        $this->password = $password;
        $this->orderId = $orderId;
        $this->groupId = $groupId;
    }

    /**
     * Execute the job.
     */
    public function handle(SenderNetService $senderNetService): void
    {
        Log::info('Sending customer credentials', [
            'user' => $this->user->email,
            'password' => $this->password,
            'orderId' => $this->orderId
        ]);
        Mail::to($this->user->email)
            ->send(new CustomerAccountCreated($this->user, $this->password, $this->orderId));

        //add user to sender net
        $senderNetService->createSubscriber($this->user->email, $this->groupId, $this->user->username);
        $senderNetService->addSubscriberToGroup($this->groupId, [$this->user->email]);
    }
}
