<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use App\Events\OrderCompleted;





test('handles concurrent payment verification requests correctly', function () {
    Event::fake();

    // Create a pending order
    $order = Order::factory()->create([
        'payment_status' => 'pending',
        'payment_reference' => 'test-reference',
        'provider_reference' => 'provider-ref-123', // Add this
        'currency' => 'NGN',
    ]);

    // Create a user that will be returned by CustomerAccountService
    $user = User::factory()->create();

    // Simplify the payment gateway mock
    $this->mock->shouldReceive('make')
        ->with('NGN')
        ->andReturnSelf()
        ->shouldReceive('verifyTransaction')
        ->with('provider-ref-123') // Use the provider reference
        ->andReturn([
            'status' => 'success',
            'transaction_id' => 'test_transaction',
            'amount' => $order->amount,
            'currency' => $order->currency
        ]);

    // Mock CustomerAccountService
    $this->customerAccountService->shouldReceive('createCustomerAccount')
        ->andReturn([
            'user' => $user,
            'created' => false
        ]);

    // Make concurrent requests
    $responses = collect(range(0, 4))->map(function () use ($order) {
        return $this->getJson("/api/orders/verify/{$order->payment_reference}");
    });

    // Count successful and already verified responses
    $successfulVerifications = $responses->filter(function ($response) {
        return $response->json('message') === 'Payment verified successfully';
    });

    $alreadyVerifiedResponses = $responses->filter(function ($response) {
        return $response->json('message') === 'Payment already verified';
    });

    // Debug responses if needed
    if ($successfulVerifications->count() !== 1 || $alreadyVerifiedResponses->count() !== 4) {
        $responses->each(function ($response) {
            info('Response status: ' . $response->status());
            info('Response content: ' . $response->content());
        });
    }

    // Assertions
    expect($successfulVerifications)->toHaveCount(1)
        ->and($alreadyVerifiedResponses)->toHaveCount(4);

    // Verify final order state
    $order->refresh();
    expect($order->payment_status)->toBe('success');

    // Verify event was dispatched exactly once
    Event::assertDispatched(OrderCompleted::class, 1);
});
