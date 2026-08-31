<?php

namespace Tests\Feature\Api;

use App\Models\BopConversation;
use App\Models\BopMessage;
use App\Services\BopAssistant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MobileChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_mobile_chat_requires_valid_bearer_token(): void
    {
        config(['bop.app_token' => 'test-mobile-token']);

        $response = $this->postJson('/api/bop/chat', [
            'message' => 'Hola BOP',
        ]);

        $response->assertUnauthorized();
    }

    public function test_mobile_chat_returns_app_message_shape_and_persists_conversation(): void
    {
        config([
            'bop.app_token' => 'test-mobile-token',
            'bop.owner_name' => 'Cristian',
            'bop.ai_provider' => 'fake',
            'bop.model' => 'fake-model',
        ]);

        $this->mock(BopAssistant::class, function ($mock): void {
            $mock->shouldReceive('reply')
                ->once()
                ->andReturn('Respuesta controlada de BOP.');
        });

        $response = $this
            ->withToken('test-mobile-token')
            ->postJson('/api/bop/chat', [
                'message' => 'Revisa el proyecto',
                'user_id' => 'mobile-owner',
                'conversation_id' => 'mobile-owner',
            ]);

        $response
            ->assertOk()
            ->assertJsonPath('role', 'bop')
            ->assertJsonPath('status', 'IDLE')
            ->assertJsonPath('text', 'Respuesta controlada de BOP.')
            ->assertJsonPath('conversation_id', 'mobile-owner');

        $this->assertDatabaseHas(BopConversation::class, [
            'channel' => 'mobile',
            'external_id' => 'mobile-owner',
        ]);

        $this->assertDatabaseHas(BopMessage::class, [
            'role' => 'user',
            'content' => 'Revisa el proyecto',
        ]);

        $this->assertDatabaseHas(BopMessage::class, [
            'role' => 'assistant',
            'content' => 'Respuesta controlada de BOP.',
        ]);
    }
}
