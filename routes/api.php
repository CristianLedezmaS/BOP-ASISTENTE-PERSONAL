<?php

use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\Mobile\AuthController as MobileAuthController;
use App\Http\Controllers\Api\Mobile\ChatController as MobileChatController;
use App\Http\Controllers\Api\Mobile\HealthController as MobileHealthController;
use App\Http\Controllers\Api\Mobile\HistoryController as MobileHistoryController;
use App\Http\Controllers\TelegramWebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/telegram/webhook', TelegramWebhookController::class);
Route::post('/chat', ChatController::class);

Route::get('/bop/health', MobileHealthController::class);
Route::middleware('throttle:6,1')->post('/auth/login', MobileAuthController::class);
Route::middleware(['bop.mobile', 'throttle:30,1'])->get('/bop/history', MobileHistoryController::class);
Route::middleware(['bop.mobile', 'throttle:30,1'])->post('/bop/chat', MobileChatController::class);
