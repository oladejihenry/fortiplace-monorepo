<?php

namespace App\Services\PaymentGateway;

interface PaymentGatewayInterface
{
    public function initializeTransaction(array $data): string | array;
    public function verifyTransaction(string $reference): array;
    public function getSupportedCurrencies(): array;
}
