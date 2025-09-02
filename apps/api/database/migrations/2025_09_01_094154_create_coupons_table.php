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
        Schema::create('coupons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->enum('type', ['percentage', 'fixed']);
            $table->decimal('amount', 10, 2);
            $table->dateTime('expires_at');
            $table->enum('status', ['active', 'inactive', 'expired'])->default('active');
            $table->foreignUuid('creator_id')->constrained('users')->onDelete('cascade');
            // $table->softDeletes();
            $table->timestamps();

            $table->index(['code', 'status']);
            $table->index(['expires_at']);
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
