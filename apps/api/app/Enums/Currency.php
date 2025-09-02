<?php

namespace App\Enums;

enum Currency: string
{
    case NGN = 'NGN';
    case GHC = 'GHC';
    case ZAR = 'ZAR';
    case KES = 'KES';

    public function label(): string
    {
        return match ($this) {
            self::NGN => 'Nigerian Naira',
            self::GHC => 'Ghanaian Cedi',
            self::ZAR => 'South African Rand',
            self::KES => 'Kenyan Shilling',
        };
    }

    public function symbol(): string
    {
        return match ($this) {
            self::NGN => '₦',
            self::GHC => '₵',
            self::ZAR => 'R',
            self::KES => 'Ksh',
        };
    }
}
