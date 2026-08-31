<?php

namespace Tests\Feature\Api;

use App\Models\BopConversation;
use App\Models\BopMessage;
use App\Models\BopUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MobileHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_mobile_history_requires_valid_bearer_token(): void
    {
        config(['bop.app_token' => 'test-mobile-token']);

        $response = $this->getJson('/api/bop/history');

        $response->assertUnauthorized();
    }

    public function test_mobile_history_returns_messages_for_conversation(): void
    {
        config(['bop.app_token' => 'test-mobile-token']);

        $user = BopUser::create([
            'channel' => 'mobile',
            'external_id' => 'mobile-owner',
            'name' => 'Cristian',
        ]);

        $conversation = BopConversation::create([
            'bop_user_id' => $user->id,
            'channel' => 'mobile',
            'external_id' => 'mobile-owner',
            'title' => 'BOP Mobile',
        ]);

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => 'Hola',
        ]);

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => 'Hola Cristian',
        ]);

        $response = $this
            ->withToken('test-mobile-token')
            ->getJson('/api/bop/history?conversation_id=mobile-owner');

        $response
            ->assertOk()
            ->assertJsonPath('conversation_id', 'mobile-owner')
            ->assertJsonPath('messages.0.role', 'user')
            ->assertJsonPath('messages.0.text', 'Hola')
            ->assertJsonPath('messages.1.role', 'bop')
            ->assertJsonPath('messages.1.text', 'Hola Cristian');
    }
}
