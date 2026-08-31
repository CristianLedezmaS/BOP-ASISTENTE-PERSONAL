<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('bop:mobile-credentials {email?}', function (?string $email = null) {
    $email ??= $this->ask('Correo autorizado para la app movil');

    $validator = Validator::make(['email' => $email], [
        'email' => ['required', 'email:rfc', 'max:255'],
    ]);

    if ($validator->fails()) {
        $this->error($validator->errors()->first('email') ?? 'Correo invalido.');

        return self::FAILURE;
    }

    $password = $this->secret('Clave privada para iniciar sesion en la app movil');

    if (! is_string($password) || strlen($password) < 8) {
        $this->error('La clave privada debe tener al menos 8 caracteres.');

        return self::FAILURE;
    }

    $this->newLine();
    $this->line('Copia estos valores en el .env del backend Laravel:');
    $this->newLine();
    $this->line('BOP_APP_TOKEN='.Str::random(64));
    $this->line('BOP_MOBILE_EMAIL='.strtolower(trim($email)));
    $this->line('BOP_MOBILE_PASSWORD_HASH='.Hash::make($password));
    $this->newLine();
    $this->warn('No guardes la clave privada en texto plano ni la subas a Git.');

    return self::SUCCESS;
})->purpose('Generate secure credentials for the BOP mobile app');

Artisan::command('bop:doctor', function () {
    $checks = [
        'APP_KEY' => filled(config('app.key')),
        'BOP_APP_TOKEN' => filled(config('bop.app_token')),
        'BOP_MOBILE_EMAIL' => filled(config('bop.mobile_email')),
        'BOP_MOBILE_PASSWORD_HASH' => filled(config('bop.mobile_password_hash')),
        'OPENAI_API_KEY' => filled(config('services.openai.api_key')),
        'TELEGRAM_BOT_TOKEN' => filled(config('services.telegram.bot_token')),
        'TELEGRAM_WEBHOOK_SECRET' => filled(config('services.telegram.webhook_secret')),
    ];

    $this->line('Estado de configuracion BOP:');

    foreach ($checks as $name => $isConfigured) {
        $this->line(sprintf(
            '%s %s',
            $isConfigured ? '[ok]     ' : '[faltante]',
            $name,
        ));
    }

    $databaseConnection = config('database.default');
    $this->newLine();
    $this->line('DB_CONNECTION='.$databaseConnection);

    if ($databaseConnection === 'sqlite') {
        $database = config('database.connections.sqlite.database');
        $exists = is_string($database) && file_exists($database);
        $this->line(sprintf('%s database sqlite: %s', $exists ? '[ok]     ' : '[faltante]', $database));
    }

    $missingRequired = collect($checks)
        ->only(['APP_KEY', 'BOP_APP_TOKEN', 'BOP_MOBILE_EMAIL', 'BOP_MOBILE_PASSWORD_HASH', 'OPENAI_API_KEY'])
        ->contains(false);

    if ($missingRequired) {
        $this->newLine();
        $this->warn('Faltan variables necesarias para usar la app movil con IA real.');

        return self::FAILURE;
    }

    $this->newLine();
    $this->info('Configuracion minima lista para app movil.');

    return self::SUCCESS;
})->purpose('Check BOP backend configuration without printing secrets');
