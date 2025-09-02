<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case CREATOR = 'creator';
    case CUSTOMER = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::CREATOR => 'Content Creator',
            self::CUSTOMER => 'Customer',
        };
    }

    public static function values(): array
    {
        return array_map(fn(UserRole $role) => $role->value, UserRole::cases());
    }
}
