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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_id')->unique();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 20, 2); // original amount
            $table->decimal('amount_ngn', 20, 2); // amount in NGN
            $table->decimal('commission_amount', 10, 2); // commission amount
            $table->decimal('seller_amount', 10, 2); // amount after commission
            $table->string('currency');
            $table->string('payment_status');
            $table->boolean('email_sent')->default(false);
            $table->string('payment_reference')->unique();
            $table->string('customer_email');
            $table->integer('download_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->string('payment_gateway')->nullable();
            $table->string('provider_reference')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['payment_reference', 'payment_status']);
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
