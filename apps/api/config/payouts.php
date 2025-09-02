<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Minimum Payout Amount
    |--------------------------------------------------------------------------
    |
    | This value is the minimum amount in NGN required for a payout to be processed.
    | Users with earnings below this amount will have their payouts delayed
    | until they reach this threshold.
    |
    */
    'minimum_amount' => env('PAYOUT_MINIMUM_AMOUNT', 5000),
];
