<?php

namespace App\Http\Controllers;

use App\Models\BopConversation;
use App\Models\BopMessage;
use App\Models\BopUser;
use App\Services\BopAssistant;
use App\Services\TelegramClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TelegramWebhookController extends Controller
{
    public function __invoke(Request $request, BopAssistant $assistant, TelegramClient $telegram): JsonResponse
    {
        if (! $this->validTelegramSecret($request)) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $message = $request->input('message') ?? $request->input('edited_message');
        $text = trim((string) data_get($message, 'text', ''));
        $chatId = data_get($message, 'chat.id');

        if ($chatId === null || $text === '') {
            return response()->json(['ok' => true, 'ignored' => true]);
        }

        $user = $this->userFromTelegram((array) $message);
        $conversation = $this->conversationForChat($user, (string) $chatId);

        BopMessage::create([
            'bop_conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $text,
            'metadata' => ['telegram_message_id' => data_get($message, 'message_id')],
        ]);

        try {
            $telegram->sendMessage($chatId, "Recibido. BOP esta pensando...\nProceso 1/3: revisando tu mensaje y contexto.\nProceso 2/3: preparando respuesta tecnica.");

            $reply = $assistant->reply($conversation, $text);

            BopMessage::create([
                'bop_conversation_id' => $conversation->id,
                'role' => 'assistant',
                'content' => $reply,
                'metadata' => ['provider' => config('bop.ai_provider'), 'model' => config('bop.model')],
            ]);

            $telegram->sendMessage($chatId, "Proceso 3/3: respuesta lista.\n\n".$reply);
        } catch (Throwable $exception) {
            Log::error('BOP Telegram failed', [
                'chat_id' => $chatId,
                'exception' => $exception,
            ]);

            $telegram->sendMessage($chatId, 'Error: '.$exception->getMessage());
        }

        return response()->json(['ok' => true]);
    }

    private function validTelegramSecret(Request $request): bool
    {
        $secret = config('services.telegram.webhook_secret');

        if (! is_string($secret) || $secret === '') {
            return true;
        }

        return hash_equals($secret, (string) $request->header('X-Telegram-Bot-Api-Secret-Token'));
    }

    /**
     * @param array<string, mixed> $message
     */
    private function userFromTelegram(array $message): BopUser
    {
        $from = data_get($message, 'from', []);
        $externalId = (string) data_get($from, 'id', data_get($message, 'chat.id'));

        return BopUser::updateOrCreate(
            ['channel' => 'telegram', 'external_id' => $externalId],
            [
                'name' => trim((string) data_get($from, 'first_name', '').' '.(string) data_get($from, 'last_name', '')) ?: null,
                'username' => data_get($from, 'username'),
                'metadata' => ['language_code' => data_get($from, 'language_code')],
            ],
        );
    }

    private function conversationForChat(BopUser $user, string $chatId): BopConversation
    {
        return BopConversation::firstOrCreate(
            ['channel' => 'telegram', 'external_id' => $chatId],
            ['bop_user_id' => $user->id, 'title' => 'Telegram '.$chatId],
        );
    }
}
