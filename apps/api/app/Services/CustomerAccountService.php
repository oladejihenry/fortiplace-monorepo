<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserRole;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Order;

class CustomerAccountService
{
    public function createCustomerAccount(Order $order)
    {
        try {
            return DB::transaction(function () use ($order) {
                $email = $order->customer_email;

                $user = User::where('email', $email)->lockForUpdate()->first();

                if (!$user) {
                    $password = Str::random(12);
                    $username = explode('@', $email)[0];

                    $user = User::create([
                        'username' => strtolower($username),
                        'email' => strtolower($email),
                        'password' => Hash::make($password),
                        'email_verified_at' => Carbon::now(),
                    ]);

                    $user->assignRole(UserRole::CUSTOMER->value);

                    $created = true;
                } else {
                    $created = false;
                }

                // Always update order with user_id here
                $order->update(['user_id' => $user->id]);

                return [
                    'created' => $created,
                    'user' => $user,
                    'password' => $created ? $password : null
                ];
            }, 3);
        } catch (\Exception $e) {
            Log::error('Error creating customer account', [
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
