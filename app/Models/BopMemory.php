<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BopMemory extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'category',
        'priority',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'priority' => 'integer',
            'metadata' => 'array',
        ];
    }
}
