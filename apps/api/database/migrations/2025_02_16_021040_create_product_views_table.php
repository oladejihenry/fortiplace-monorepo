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
        Schema::create('product_views', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('country')->nullable();
            $table->string('city')->nullable();
            $table->string('device_type')->nullable();
            $table->timestamp('viewed_at');
            $table->timestamps();

            $table->index('product_id', 'viewed_at');
            $table->index(['ip_address', 'product_id', 'viewed_at']);
        });

        Schema::create('product_view_stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('period_type');
            $table->date('period_date');
            $table->integer('views')->default(0);
            $table->integer('unique_views')->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'period_type', 'period_date']);
        });

        Schema::create('store_view_stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('period_type');
            $table->date('period_date');
            $table->integer('views')->default(0);
            $table->integer('unique_views')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'period_type', 'period_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_views');
        Schema::dropIfExists('product_view_stats');
        Schema::dropIfExists('store_view_stats');
    }
};
