<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\TelegramWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/telegram/webhook', TelegramWebhookController::class);
Route::post('/chat', ChatController::class);
