<?php

namespace Tests\Feature\Api;

use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MobileAuthTest extends TestCase
{
    public function test_mobile_owner_can_login_with_configured_credentials(): void
    {
        config([
            'bop.app_token' => 'test-mobile-token',
            'bop.mobile_email' => 'cristian@example.com',
            'bop.mobile_password_hash' => Hash::make('secret-pass'),
            'bop.owner_name' => 'Cristian',
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'CRISTIAN@example.com',
            'password' => 'secret-pass',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('token', 'test-mobile-token')
            ->assertJsonPath('user.id', 'mobile-owner')
            ->assertJsonPath('user.email', 'cristian@example.com');
    }

    public function test_mobile_login_rejects_invalid_credentials(): void
    {
        config([
            'bop.app_token' => 'test-mobile-token',
            'bop.mobile_email' => 'cristian@example.com',
            'bop.mobile_password_hash' => Hash::make('secret-pass'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'cristian@example.com',
            'password' => 'wrong-pass',
        ]);

        $response->assertUnauthorized();
    }
}
