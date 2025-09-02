<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'paystack' => [
        'secret_key' => env('PAYSTACK_SECRET_KEY'),
    ],

    'flutterwave' => [
        'secret_key' => env('FLUTTERWAVE_SECRET_KEY'),
        'public_key' => env('FLUTTERWAVE_PUBLIC_KEY'),
        'webhook_secret' => env('FLUTTERWAVE_WEBHOOK_SECRET'),
    ],

    'stripe' => [
        'secret_key' => env('STRIPE_SECRET_KEY'),
        'publishable_key' => env('STRIPE_PUBLISHABLE_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'kora' => [
        'secret_key' => env('KORA_SECRET_KEY'),
        'public_key' => env('KORA_PUBLIC_KEY'),
        'encryption_key' => env('KORA_ENCRYPTION_KEY'),
    ],

    'wise' => [
        'api_key' => env('WISE_API_KEY'),
        'base_url' => env('WISE_BASE_URL'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

    'sender_net' => [
        'api_key' => env('SENDER_NET_API_KEY'),
        'group_id' => env('SENDER_NET_GROUP_ID'),
        'normal_user_group_id' => env('SENDER_NET_NORMAL_USER_GROUP_ID'),
    ],

    'twitter' => [
        'client_id' => env('TWITTER_CLIENT_ID'),
        'client_secret' => env('TWITTER_CLIENT_SECRET'),
        'redirect' => env('TWITTER_REDIRECT_URI'),
        'bearer_token' => env('TWITTER_BEARER_TOKEN'),
    ],

    'vercel' => [
        'token' => env('VERCEL_API_TOKEN'),
        'project_id' => env('VERCEL_PROJECT_ID'),
        'team_id' => env('VERCEL_TEAM_ID'),
    ],

    'pawapay' => [
        'secret_key' => env('PAWAPAY_SECRET_KEY'),
        'base_url' => env('PAWAPAY_BASE_URL'),
        'public_key' => env('PAWAPAY_PUBLIC_KEY'),
    ],

];
