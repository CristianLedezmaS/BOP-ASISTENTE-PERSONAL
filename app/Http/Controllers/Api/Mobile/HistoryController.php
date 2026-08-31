<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MobileHistoryRequest;
use App\Models\BopConversation;
use Illuminate\Http\JsonResponse;

class HistoryController extends Controller
{
    public function __invoke(MobileHistoryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $conversationId = $validated['conversation_id'] ?? 'mobile-owner';
        $limit = (int) ($validated['limit'] ?? 50);

        $conversation = BopConversation::query()
            ->where('channel', 'mobile')
            ->where('external_id', $conversationId)
            ->first();

        if (! $conversation) {
            return response()->json([
                'conversation_id' => $conversationId,
                'messages' => [],
            ]);
        }

        $messages = $conversation->messages()
            ->latest()
            ->limit($limit)
            ->get()
            ->reverse()
            ->values()
            ->map(fn ($message): array => [
                'id' => 'm-'.$message->id,
                'role' => $message->role === 'assistant' ? 'bop' : 'user',
                'status' => 'IDLE',
                'text' => $message->content,
                'conversation_id' => $conversation->external_id,
            ]);

        return response()->json([
            'conversation_id' => $conversation->external_id,
            'messages' => $messages,
        ]);
    }
}
