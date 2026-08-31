<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MobileChatRequest;
use App\Models\BopConversation;
use App\Models\BopMessage;
use App\Models\BopUser;
use App\Services\BopAssistant;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    public function __invoke(MobileChatRequest $request, BopAssistant $assistant): JsonResponse
    {
        $validated = $request->validated();
        $externalUserId = $validated['user_id'] ?? 'mobile-owner';
        $conversationId = $validated['conversation_id'] ?? $externalUserId;

        $user = BopUser::firstOrCreate(
            ['channel' => 'mobile', 'external_id' => $externalUserId],
            ['name' => config('bop.owner_name')]
        );

        $conversation = BopConversation::firstOrCreate(
            ['channel' => 'mobile', 'external_id' => $conversationId],
            ['bop_user_id' => $user->id, 'title' => 'BOP Mobile']
        );

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $validated['message'],
        ]);

        $reply = $assistant->reply($conversation, (string) $validated['message']);

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => $reply,
            'metadata' => ['provider' => config('bop.ai_provider'), 'model' => config('bop.model')],
        ]);

        return response()->json([
            'id' => 'b-'.now()->timestamp.'-'.$conversation->id,
            'role' => 'bop',
            'status' => 'IDLE',
            'text' => $reply,
            'conversation_id' => $conversation->external_id,
        ]);
    }
}
