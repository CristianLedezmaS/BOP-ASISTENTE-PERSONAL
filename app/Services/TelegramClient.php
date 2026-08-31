<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class TelegramClient
{
    public function sendMessage(int|string $chatId, string $text): void
    {
        $token = config('services.telegram.bot_token');

        if (! is_string($token) || $token === '') {
            throw new RuntimeException('Falta configurar TELEGRAM_BOT_TOKEN.');
        }

        $response = Http::timeout(15)
            ->asJson()
            ->post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $this->limit($text),
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Telegram respondio con error: '.$response->body());
        }
    }

    private function limit(string $text): string
    {
        return mb_substr($text, 0, 3900);
    }
}
