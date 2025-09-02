<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Enums\UserRole;
use App\Enums\PermissionEnum;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->command->info('Creating permissions...');
        foreach (PermissionEnum::cases() as $permission) {
            Permission::findOrCreate($permission->value, 'web');
        }

        $this->command->info('Creating roles...');
        $customerRole = Role::findOrCreate(UserRole::CUSTOMER->value, 'web');
        $creatorRole = Role::findOrCreate(UserRole::CREATOR->value, 'web');
        $adminRole = Role::findOrCreate(UserRole::ADMIN->value, 'web');


        $this->command->info('Assigning permissions to roles...');
        //Create permissions
        $creatorPermissions = [
            PermissionEnum::MANAGE_STORE->value,
            PermissionEnum::EDIT_STORE_SETTINGS->value,
            PermissionEnum::VIEW_STORE_ANALYTICS->value,
            PermissionEnum::CREATE_PRODUCTS->value,
            PermissionEnum::EDIT_PRODUCTS->value,
            PermissionEnum::DELETE_PRODUCTS->value,
            PermissionEnum::PUBLISH_PRODUCTS->value,
            PermissionEnum::VIEW_ORDERS->value,
            PermissionEnum::PROCESS_ORDERS->value,
            PermissionEnum::CANCEL_ORDERS->value,
            PermissionEnum::VIEW_USERS->value,
            PermissionEnum::CREATE_USERS->value,
            PermissionEnum::EDIT_USERS->value,
            PermissionEnum::DELETE_USERS->value,
            PermissionEnum::ACCESS_ADMIN_PANEL->value,
            PermissionEnum::MANAGE_SETTINGS->value,
            PermissionEnum::MANAGE_PAYOUTS->value,
        ];

        $creatorRole->syncPermissions($creatorPermissions);

        $adminRole->syncPermissions(Permission::all());

        $this->command->info('Roles and permissions created successfully!');
    }
}
