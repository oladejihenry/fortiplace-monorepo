<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('custom_domain')->nullable();
            $table->string('custom_domain_status')->default('pending');
            $table->string('custom_domain_verification_token')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('custom_domain');
            $table->dropColumn('custom_domain_status');
            $table->dropColumn('custom_domain_verification_token');
        });
    }
};
