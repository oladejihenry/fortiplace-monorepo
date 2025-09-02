<?php

namespace App\Enums;

enum PermissionEnum: string
{
    // Store management
    case MANAGE_STORE = 'manage store';
    case EDIT_STORE_SETTINGS = 'edit store settings';
    case VIEW_STORE_ANALYTICS = 'view store analytics';

        // Product management
    case CREATE_PRODUCTS = 'create products';
    case EDIT_PRODUCTS = 'edit products';
    case DELETE_PRODUCTS = 'delete products';
    case PUBLISH_PRODUCTS = 'publish products';

        // Order management
    case VIEW_ORDERS = 'view orders';
    case PROCESS_ORDERS = 'process orders';
    case CANCEL_ORDERS = 'cancel orders';

        // User management
    case VIEW_USERS = 'view users';
    case CREATE_USERS = 'create users';
    case EDIT_USERS = 'edit users';
    case DELETE_USERS = 'delete users';

        // System management
    case ACCESS_ADMIN_PANEL = 'access admin panel';
    case MANAGE_SETTINGS = 'manage settings';
    case MANAGE_PAYOUTS = 'manage payouts';

    public function label(): string
    {
        return match ($this) {
            self::MANAGE_STORE => 'Manage Store',
            self::EDIT_STORE_SETTINGS => 'Edit Store Settings',
            self::VIEW_STORE_ANALYTICS => 'View Store Analytics',
            self::CREATE_PRODUCTS => 'Create Products',
            self::EDIT_PRODUCTS => 'Edit Products',
            self::DELETE_PRODUCTS => 'Delete Products',
            self::PUBLISH_PRODUCTS => 'Publish Products',
            self::VIEW_ORDERS => 'View Orders',
            self::PROCESS_ORDERS => 'Process Orders',
            self::CANCEL_ORDERS => 'Cancel Orders',
            self::VIEW_USERS => 'View Users',
            self::CREATE_USERS => 'Create Users',
            self::EDIT_USERS => 'Edit Users',
            self::DELETE_USERS => 'Delete Users',
            self::ACCESS_ADMIN_PANEL => 'Access Admin Panel',
            self::MANAGE_SETTINGS => 'Manage Settings',
            self::MANAGE_PAYOUTS => 'Manage Payouts',
            default => str_replace('_', ' ', strtolower($this->name)),
        };
    }

    public static function values(): array
    {
        return array_map(fn(PermissionEnum $permission) => $permission->value, self::cases());
    }
}
