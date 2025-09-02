<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

//Daily payouts
Schedule::command('payouts:process-daily')
    ->dailyAt('01:00')
    ->withoutOverlapping(60)
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/payouts-daily.log'));

//Weekly payouts
Schedule::command('payouts:process-weekly')
    ->weeklyOn(1, '01:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/payouts-weekly.log'));

//Monthly payouts
Schedule::command('payouts:process-monthly')
    ->weekly()
    ->fridays()
    ->at('01:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/payouts-monthly.log'));

Schedule::command('orders:send-reminders')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/orders.log'));


Schedule::command('files:cleanup-temp')
    ->daily()
    ->at('01:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/files.log'));


Schedule::command('products:cleanup-temp-files')
    ->daily()
    ->at('01:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/products.log'));


Schedule::command('coupons:expire')
    ->hourly()
    ->withoutOverlapping()
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/coupons.log'));



// Schedule::command('custom-domain:check-verification')
// Schedule::command('promotions:process')
//     ->everyMinute()
//     ->withoutOverlapping()
//     ->runInBackground()
//     ->appendOutputTo(storage_path('logs/promotions.log'));


// Schedule::command('payouts:process-monthly')
//     ->monthlyOn(date('t'), '01:00')
//     ->when(function () {
//         return now()->format('l') === 'Friday';
//     })
//     ->withoutOverlapping()
//     ->runInBackground()
//     ->appendOutputTo(storage_path('logs/payouts.log'));
