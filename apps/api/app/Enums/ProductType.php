<?php

namespace App\Enums;

enum ProductType: string
{
    case DIGITAL_PRODUCT = 'digital_product';
    case EBOOK = 'ebook';
    case COURSE = 'course';

    public function label(): string
    {
        return match ($this) {
            self::DIGITAL_PRODUCT => 'digital_product',
            self::EBOOK => 'ebook',
            self::COURSE => 'course',
        };
    }

    public function allowedFileTypes(): array
    {
        return match ($this) {
            self::DIGITAL_PRODUCT => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
            self::EBOOK => ['application/pdf'],
            self::COURSE => ['application/pdf'],
        };
    }

    public function supportsMultipleFiles(): bool
    {
        return match ($this) {
            self::COURSE => true,
            default => false,
        };
    }
}
