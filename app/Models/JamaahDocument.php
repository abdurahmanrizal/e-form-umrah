<?php

namespace App\Models;

use App\DocumentStatus;
use Database\Factories\JamaahDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $storage_path
 * @property string $original_name
 * @property DocumentStatus $status
 * @property int|null $verified_by
 * @property Carbon|null $expiry_date
 * @property Jamaah $jamaah
 * @property DocumentType $documentType
 */
#[Fillable(['jamaah_id', 'package_registration_id', 'document_type_id', 'document_number', 'storage_path', 'original_name', 'mime_type', 'file_size', 'issue_date', 'expiry_date', 'status', 'verified_at', 'verified_by', 'note'])]
class JamaahDocument extends Model
{
    /** @use HasFactory<JamaahDocumentFactory> */
    use HasFactory;

    protected $attributes = ['status' => 'uploaded'];

    protected static function booted(): void
    {
        static::creating(function (JamaahDocument $document): void {
            $document->uuid ??= (string) Str::uuid();
        });
    }

    protected function casts(): array
    {
        return ['status' => DocumentStatus::class, 'issue_date' => 'date', 'expiry_date' => 'date', 'verified_at' => 'datetime'];
    }

    /** @return BelongsTo<Jamaah, $this> */
    public function jamaah(): BelongsTo
    {
        return $this->belongsTo(Jamaah::class);
    }

    /** @return BelongsTo<DocumentType, $this> */
    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    /** @return BelongsTo<PackageRegistration, $this> */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(PackageRegistration::class, 'package_registration_id');
    }
}
