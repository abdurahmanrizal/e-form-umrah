<?php

namespace App\Models;

use Database\Factories\DocumentTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property array<int, string> $allowed_extensions
 * @property int $max_file_size_kb
 * @property bool $requires_expiry_date
 */
#[Fillable(['code', 'name', 'is_required_default', 'requires_expiry_date', 'allowed_extensions', 'max_file_size_kb', 'is_active'])]
class DocumentType extends Model
{
    /** @use HasFactory<DocumentTypeFactory> */
    use HasFactory;

    protected $attributes = ['is_required_default' => false, 'requires_expiry_date' => false, 'max_file_size_kb' => 5120, 'is_active' => true];

    protected function casts(): array
    {
        return ['is_required_default' => 'boolean', 'requires_expiry_date' => 'boolean', 'allowed_extensions' => 'array', 'is_active' => 'boolean'];
    }

    /** @return HasMany<JamaahDocument, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(JamaahDocument::class);
    }
}
