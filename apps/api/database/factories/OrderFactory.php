<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'order_id' => 'ORD_' . Str::random(10),
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'amount_ngn' => $this->faker->randomFloat(2, 10, 1000),
            'commission_amount' => $this->faker->randomFloat(2, 1, 100),
            'seller_amount' => $this->faker->randomFloat(2, 10, 900),
            'currency' => 'NGN',
            'payment_status' => 'pending',
            'customer_email' => $this->faker->email,
            'payment_reference' => Str::random(20),
            'metadata' => [
                'customer_details' => [
                    'firstName' => $this->faker->firstName,
                    'lastName' => $this->faker->lastName,
                    'country' => $this->faker->country,
                ],
                'products' => []
            ]
        ];
    }
}
