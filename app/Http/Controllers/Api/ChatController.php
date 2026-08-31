<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BopConversation;
use App\Models\BopMessage;
use App\Models\BopUser;
use App\Services\BopAssistant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChatController extends Controller
{
    public function __invoke(Request $request, BopAssistant $assistant): JsonResponse
    {
        $token = config('bop.app_token');

        if (! is_string($token) || $token === '') {
            return response()->json(['message' => 'BOP_APP_TOKEN is not configured'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if (! hash_equals($token, (string) $request->bearerToken())) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:12000'],
            'user_id' => ['nullable', 'string', 'max:120'],
            'conversation_id' => ['nullable', 'string', 'max:120'],
        ]);

        $externalUserId = $validated['user_id'] ?? 'mobile-owner';

        $user = BopUser::firstOrCreate(
            ['channel' => 'mobile', 'external_id' => $externalUserId],
            ['name' => config('bop.owner_name')],
        );

        $conversation = BopConversation::firstOrCreate(
            ['channel' => 'mobile', 'external_id' => $validated['conversation_id'] ?? $externalUserId],
            ['bop_user_id' => $user->id, 'title' => 'BOP Mobile'],
        );

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $validated['message'],
        ]);

        $reply = $assistant->reply($conversation, $validated['message']);

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => $reply,
            'metadata' => ['provider' => config('bop.ai_provider'), 'model' => config('bop.model')],
        ]);

        return response()->json([
            'reply' => $reply,
            'conversation_id' => $conversation->external_id,
        ]);
    }
}
