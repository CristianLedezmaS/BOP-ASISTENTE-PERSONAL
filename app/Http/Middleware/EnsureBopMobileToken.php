<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBopMobileToken
{
    /**
     * @param Closure(Request): Response $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = config('bop.app_token');
        $bearerToken = $request->bearerToken();

        if (! is_string($token) || $token === '' || ! is_string($bearerToken) || ! hash_equals($token, $bearerToken)) {
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
