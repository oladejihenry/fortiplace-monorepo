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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('product_id', 12)->unique();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->text('content')->nullable();
            $table->text('description')->nullable();
            $table->string('product_type');
            $table->string('cover_image')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('product_url')->unique();
            $table->string('product_file')->nullable();
            $table->json('preview_images')->nullable();
            $table->boolean('is_published')->default(false);
            $table->integer('version')->default(1);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'is_published']);
            $table->index('product_url');
            $table->index('product_type');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
