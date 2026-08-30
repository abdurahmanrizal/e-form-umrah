<?php

namespace App\Models;

use App\Gender;
use Database\Factories\JamaahFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property string $full_name
 * @property string $phone
 * @property PackageRegistration|null $latestRegistration
 * @property Collection<int, JamaahDocument> $documents
 * @property string|null $signature_path
 * @property Carbon|null $signature_signed_at
 */
#[Fillable(['full_name', 'gender', 'birth_place', 'birth_date', 'nik', 'passport_number', 'passport_issue_date', 'passport_expiry_date', 'passport_issuing_office', 'phone', 'email', 'address', 'province', 'city', 'district', 'village', 'postal_code', 'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone', 'emergency_contact_address', 'blood_type', 'medical_notes', 'special_assistance', 'wheelchair_required', 'dietary_notes', 'internal_notes', 'jamaah_notes', 'archived_at', 'signature_path', 'signature_signed_at'])]
class Jamaah extends Model
{
    /** @use HasFactory<JamaahFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Jamaah $jamaah): void {
            $jamaah->uuid ??= (string) Str::uuid();
        });
    }

    protected function casts(): array
    {
        return [
            'gender' => Gender::class,
            'birth_date' => 'date',
            'passport_issue_date' => 'date',
            'passport_expiry_date' => 'date',
            'wheelchair_required' => 'boolean',
            'archived_at' => 'datetime',
            'signature_signed_at' => 'datetime',
        ];
    }

    /** @return HasMany<PackageRegistration, $this> */
    public function registrations(): HasMany
    {
        return $this->hasMany(PackageRegistration::class);
    }

    /** @return HasOne<PackageRegistration, $this> */
    public function latestRegistration(): HasOne
    {
        return $this->hasOne(PackageRegistration::class)->latestOfMany();
    }

    /** @return HasMany<JamaahDocument, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(JamaahDocument::class);
    }
}
