<?php

namespace App\Http\Controllers\Api\Mobile;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\MobileLoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function __invoke(MobileLoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $token = config('bop.app_token');
        $ownerEmail = config('bop.mobile_email');
        $passwordHash = config('bop.mobile_password_hash');

        if (! is_string($token) || $token === '' || ! is_string($ownerEmail) || $ownerEmail === '' || ! is_string($passwordHash) || $passwordHash === '') {
            return response()->json(['message' => 'BOP mobile auth is not configured'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $email = strtolower(trim((string) $validated['email']));

        if (! hash_equals(strtolower($ownerEmail), $email) || ! Hash::check((string) $validated['password'], $passwordHash)) {
            return response()->json(['message' => 'Credenciales invalidas.'], Response::HTTP_UNAUTHORIZED);
        }

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => 'mobile-owner',
                'email' => $email,
                'name' => config('bop.owner_name'),
            ],
        ]);
    }
}
