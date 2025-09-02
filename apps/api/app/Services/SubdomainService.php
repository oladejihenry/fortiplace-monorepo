<?php

namespace App\Services;

use App\Models\Store;
use Illuminate\Support\Str;

class SubdomainService
{
    /**
     * Generate a subdomain from an input
     * @param string $input
     * @return string
     */
    public function generateSubdomain(string $input): string
    {
        //Remove email domain if it's an email
        $base = str_contains($input, '@')
            ? explode('@', $input)[0]
            : $input;

        //Clean the string
        $subdomain = Str::of($base)
            ->lower()
            ->trim()
            ->replaceMatches('/[^a-z0-9]/', '')
            ->replaceMatches('/\s+/', '');

        //Ensure it is not too long
        $subdomain = Str::limit($subdomain, 63, '');

        //Make unique if it already exists
        $originalSubdomain = $subdomain;
        $counter = 1;

        while (Store::where('subdomain', $subdomain)->exists()) {
            $subdomain = $originalSubdomain . $counter;
            $counter++;
        }

        return $subdomain;
    }

    /**
     * Check if a subdomain is valid
     * @param string $subdomain
     * @return bool
     */
    public function isValidSubdomain(string $subdomain): bool
    {
        //Check length
        if (strlen($subdomain) < 3 || strlen($subdomain) > 63) {
            return false;
        }

        // Check format (letters, numbers, and hyphens only)
        if (!preg_match('/^[a-z0-9][a-z0-9-]*[a-z0-9]$/', $subdomain)) {
            return false;
        }

        // Check reserved words
        $reserved = [
            'www',
            'admin',
            'mail',
            'ftp',
            'blog',
            'shop',
            'test',
            'demo',
            'dev',
            'staging',
            'preview',
            'sandbox',
            'test',
            'example',
            'invalid',
            'none',
            'null',
            'unknown'
        ];
        if (in_array($subdomain, $reserved)) {
            return false;
        }

        return true;
    }
}
