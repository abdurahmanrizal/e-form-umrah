<?php

namespace App\Models;

use App\RegistrationStatus;
use Database\Factories\PackageRegistrationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $registration_number
 * @property int $jamaah_id
 * @property int $umrah_package_id
 * @property int $seat_count
 * @property RegistrationStatus $status
 * @property Jamaah $jamaah
 * @property UmrahPackage $package
 */
#[Fillable(['registration_number', 'jamaah_id', 'umrah_package_id', 'seat_count', 'status', 'registered_at', 'cancelled_at', 'cancelled_by', 'cancellation_reason'])]
class PackageRegistration extends Model
{
    /** @use HasFactory<PackageRegistrationFactory> */
    use HasFactory;

    protected $attributes = ['seat_count' => 1, 'status' => 'registered'];

    protected function casts(): array
    {
        return ['status' => RegistrationStatus::class, 'registered_at' => 'datetime', 'cancelled_at' => 'datetime'];
    }

    /** @return BelongsTo<Jamaah, $this> */
    public function jamaah(): BelongsTo
    {
        return $this->belongsTo(Jamaah::class);
    }

    /** @return BelongsTo<UmrahPackage, $this> */
    public function package(): BelongsTo
    {
        return $this->belongsTo(UmrahPackage::class, 'umrah_package_id');
    }

    /** @return HasMany<RegistrationPackageHistory, $this> */
    public function histories(): HasMany
    {
        return $this->hasMany(RegistrationPackageHistory::class);
    }
}
