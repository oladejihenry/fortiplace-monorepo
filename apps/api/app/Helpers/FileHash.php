<?php

namespace App\Helpers;

class FileHash
{
    /**
     * Hash a file using SHA-256
     * 
     * @param string $path
     * @return string
     */
    public static function hash(string $path): string
    {
        return hash_file('sha256', $path);
    }
}
