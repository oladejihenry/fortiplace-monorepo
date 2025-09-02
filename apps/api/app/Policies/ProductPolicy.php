<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class ProductPolicy
{
    public function show(?User $user, Product $product)
    {
        return  $product->user_id === $user->id
            ? Response::allow() : Response::deny('You do not own this product.');
    }

    public function update(User $user, Product $product)
    {
        return $product->user_id === $user->id
            ? Response::allow() : Response::deny('You do not own this product.');
    }
}
