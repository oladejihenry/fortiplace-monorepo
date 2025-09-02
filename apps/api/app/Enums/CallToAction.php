<?php

namespace App\Enums;

enum CallToAction: string
{
    case BUY_NOW = 'buy_now';
    case I_WANT_THIS = 'i_want_this';
    case PAY_NOW = 'pay_now';


    public function label(): string
    {
        return match ($this) {
            self::BUY_NOW => 'Buy Now',
            self::I_WANT_THIS => 'I Want This',
            self::PAY_NOW => 'Pay Now',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
