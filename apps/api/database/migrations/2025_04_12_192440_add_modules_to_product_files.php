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
        Schema::table('product_files', function (Blueprint $table) {
            $table->string('module_title')->nullable();
            $table->string('module_description')->nullable();
            $table->integer('module_order')->nullable();

            $table->index(['product_id', 'module_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_files', function (Blueprint $table) {
            $table->dropColumn(['module_title', 'module_description', 'module_order']);
            $table->dropIndex(['product_id', 'module_order']);
        });
    }
};
