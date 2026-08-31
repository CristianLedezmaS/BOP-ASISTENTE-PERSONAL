<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class MobileHealthTest extends TestCase
{
    public function test_mobile_health_returns_public_backend_status(): void
    {
        config([
            'app.name' => 'BOP',
            'bop.owner_name' => 'Cristian',
            'bop.timezone' => 'America/La_Paz',
            'bop.ai_provider' => 'openai',
            'bop.model' => 'gpt-4.1-mini',
        ]);

        $response = $this->getJson('/api/bop/health');

        $response
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('owner', 'Cristian')
            ->assertJsonPath('timezone', 'America/La_Paz');
    }
}
