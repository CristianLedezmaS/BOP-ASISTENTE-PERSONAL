<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class MobileChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:12000'],
            'user_id' => ['nullable', 'string', 'max:120'],
            'conversation_id' => ['nullable', 'string', 'max:120'],
        ];
    }

}
