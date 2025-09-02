<?php

namespace App\Helpers;

class UrlHelper
{
    public static function getStoreUrl(string $subdomain, string $path = ''): string
    {
        $baseUrl = config('app.frontend_url');
        $protocol = '';

        if (str_starts_with($baseUrl, 'http://')) {
            $protocol = 'http://';
            $baseUrl = str_replace('http://', '', $baseUrl);
        } else if (str_starts_with($baseUrl, 'https://')) {
            $protocol = 'https://';
            $baseUrl = str_replace('https://', '', $baseUrl);
        }

        return $protocol . $subdomain . '.' . $baseUrl . ($path ? '/' . ltrim($path, '/') : '');
    }
}
