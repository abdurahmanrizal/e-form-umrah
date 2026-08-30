<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['umrah_package_id', 'document_type_id', 'is_required'])]
class PackageDocumentRequirement extends Model
{
    protected $attributes = ['is_required' => true];

    protected function casts(): array
    {
        return ['is_required' => 'boolean'];
    }

    /** @return BelongsTo<UmrahPackage, $this> */
    public function package(): BelongsTo
    {
        return $this->belongsTo(UmrahPackage::class, 'umrah_package_id');
    }

    /** @return BelongsTo<DocumentType, $this> */
    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }
}
