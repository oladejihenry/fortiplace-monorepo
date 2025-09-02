<?php

namespace App\Enums;

enum Os: string
{
    case ANDROID = 'Android';
    case IOS = 'iOS';
    case WINDOWS = 'Windows';
    case MACOS = 'macOS';
    case LINUX = 'Linux';
    case UNKNOWN = 'Unknown OS';
}
