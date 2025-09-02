<?php

namespace App\Helpers;

class CurrencyHelper
{
    public static function getCurrencySymbol($currency)
    {
        switch ($currency) {
            case 'NGN':
                return '₦';
            case 'USD':
                return '$';
            case 'EUR':
                return '€';
            case 'GBP':
                return '£';
            case 'GHS':
                return '₵';
            case 'KES':
                return 'KSh';
            case 'ZAR':
                return 'R';
            default:
                return $currency;
        }
    }
}
