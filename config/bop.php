<?php

return [
    'owner_name' => env('BOP_OWNER_NAME', 'Cristian'),
    'timezone' => env('BOP_TIMEZONE', 'America/La_Paz'),
    'app_token' => env('BOP_APP_TOKEN'),
    'mobile_email' => env('BOP_MOBILE_EMAIL'),
    'mobile_password_hash' => env('BOP_MOBILE_PASSWORD_HASH'),
    'ai_provider' => env('BOP_AI_PROVIDER', 'openai'),
    'model' => env('BOP_AI_MODEL', 'gpt-4.1-mini'),
    'temperature' => (float) env('BOP_AI_TEMPERATURE', 0.3),
    'max_context_messages' => (int) env('BOP_MAX_CONTEXT_MESSAGES', 18),
];
