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
        Schema::create('promotions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('subject');
            $table->text('content');
            $table->json('target_audience')->nullable(); // For filtering users
            $table->integer('send_count')->default(0); // Track number of times sent
            $table->integer('max_sends')->default(1); // Maximum times to send
            $table->timestamp('last_sent_at')->nullable();
            $table->timestamp('next_send_at')->nullable();
            $table->string('status')->default('draft'); // draft, scheduled, completed
            $table->json('schedule_config')->nullable(); // For recurring schedules
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
