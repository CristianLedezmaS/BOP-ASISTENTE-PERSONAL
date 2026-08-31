<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BopConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'bop_user_id',
        'channel',
        'external_id',
        'title',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(BopUser::class, 'bop_user_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(BopMessage::class);
    }
}
