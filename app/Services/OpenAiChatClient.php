<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiChatClient
{
    /**
     * @param array<int, array{role: string, content: string}> $messages
     */
    public function complete(array $messages): string
    {
        $apiKey = config('services.openai.api_key');

        if (! is_string($apiKey) || $apiKey === '') {
            throw new RuntimeException('Falta configurar OPENAI_API_KEY.');
        }

        $response = Http::withToken($apiKey)
            ->timeout(45)
            ->acceptJson()
            ->post(rtrim((string) config('services.openai.base_url'), '/').'/chat/completions', [
                'model' => config('bop.model'),
                'temperature' => config('bop.temperature'),
                'messages' => $messages,
            ]);

        if ($response->failed()) {
            throw new RuntimeException('OpenAI respondio con error: '.$response->body());
        }

        $content = $response->json('choices.0.message.content');

        if (! is_string($content) || trim($content) === '') {
            throw new RuntimeException('La IA no entrego texto final.');
        }

        return trim($content);
    }
}
