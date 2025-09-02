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
        Schema::create('ratings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->uuid('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('rating');
            $table->string('session_id')->nullable();
            $table->string('ip_address')->nullable();

            $table->unique(['product_id', 'user_id', 'session_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
