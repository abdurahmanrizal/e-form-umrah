<?php

namespace App\Models;

use App\PackageStatus;
use App\RegistrationStatus;
use Database\Factories\UmrahPackageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property Carbon $departure_date
 * @property Carbon $return_date
 * @property int $total_seats
 * @property int|null $used_seats
 * @property PackageStatus $status
 * @property Carbon|null $registration_open_date
 * @property Carbon|null $registration_close_date
 */
#[Fillable(['code', 'name', 'description', 'departure_date', 'return_date', 'total_seats', 'price', 'registration_open_date', 'registration_close_date', 'meeting_point', 'airline', 'hotel_makkah', 'hotel_madinah', 'room_type', 'notes', 'status', 'activated_at', 'archived_at'])]
class UmrahPackage extends Model
{
    /** @use HasFactory<UmrahPackageFactory> */
    use HasFactory;

    protected $attributes = ['status' => 'draft'];

    protected function casts(): array
    {
        return [
            'status' => PackageStatus::class,
            'departure_date' => 'date',
            'return_date' => 'date',
            'registration_open_date' => 'date',
            'registration_close_date' => 'date',
            'activated_at' => 'datetime',
            'archived_at' => 'datetime',
            'price' => 'decimal:2',
        ];
    }

    /** @return BelongsToMany<Facility, $this> */
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class)->withTimestamps();
    }

    /** @return HasMany<PackageRegistration, $this> */
    public function registrations(): HasMany
    {
        return $this->hasMany(PackageRegistration::class);
    }

    /** @return HasMany<PackageDocumentRequirement, $this> */
    public function documentRequirements(): HasMany
    {
        return $this->hasMany(PackageDocumentRequirement::class);
    }

    public function usedSeats(): int
    {
        return (int) $this->registrations()
            ->where('status', '!=', RegistrationStatus::Cancelled)
            ->sum('seat_count');
    }

    public function availableSeats(): int
    {
        return max(0, $this->total_seats - $this->usedSeats());
    }

    /**
     * @param  Builder<UmrahPackage>  $query
     * @return Builder<UmrahPackage>
     */
    public function scopeAvailableForRegistration(Builder $query): Builder
    {
        return $query
            ->where('status', PackageStatus::Active)
            ->where(function (Builder $query): void {
                $query->whereNull('registration_open_date')->orWhereDate('registration_open_date', '<=', today());
            })
            ->where(function (Builder $query): void {
                $query->whereNull('registration_close_date')->orWhereDate('registration_close_date', '>=', today());
            });
    }
}
