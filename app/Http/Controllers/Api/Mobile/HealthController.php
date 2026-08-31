<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'app' => config('app.name'),
            'owner' => config('bop.owner_name'),
            'timezone' => config('bop.timezone'),
            'ai_provider' => config('bop.ai_provider'),
            'model' => config('bop.model'),
        ]);
    }
}
