<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bop_users', function (Blueprint $table): void {
            $table->id();
            $table->string('channel', 40);
            $table->string('external_id', 120);
            $table->string('name')->nullable();
            $table->string('username')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['channel', 'external_id']);
        });

        Schema::create('bop_conversations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('bop_user_id')->nullable()->constrained('bop_users')->nullOnDelete();
            $table->string('channel', 40);
            $table->string('external_id', 120);
            $table->string('title')->nullable();
            $table->timestamps();

            $table->unique(['channel', 'external_id']);
        });

        Schema::create('bop_messages', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('bop_conversation_id')->constrained('bop_conversations')->cascadeOnDelete();
            $table->string('role', 20);
            $table->longText('content');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['bop_conversation_id', 'created_at']);
        });

        Schema::create('bop_memories', function (Blueprint $table): void {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->string('category', 60)->default('general');
            $table->unsignedTinyInteger('priority')->default(3);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['category', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bop_memories');
        Schema::dropIfExists('bop_messages');
        Schema::dropIfExists('bop_conversations');
        Schema::dropIfExists('bop_users');
    }
};
