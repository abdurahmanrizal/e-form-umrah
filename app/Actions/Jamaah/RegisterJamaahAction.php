<?php

namespace App\Actions\Jamaah;

use App\Models\Jamaah;
use App\Models\PackageRegistration;
use App\Models\RegistrationSequence;
use App\Models\UmrahPackage;
use App\Models\User;
use App\PackageStatus;
use App\RegistrationStatus;
use App\Support\ActivityLogger;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RegisterJamaahAction
{
    public function __construct(private ActivityLogger $activityLogger) {}

    /** @param array<string, mixed> $data */
    public function execute(array $data, ?User $user): Jamaah
    {
        return DB::transaction(function () use ($data, $user): Jamaah {
            $package = UmrahPackage::query()->whereKey($data['umrah_package_id'])->lockForUpdate()->firstOrFail();

            if ($package->status !== PackageStatus::Active) {
                throw ValidationException::withMessages(['umrah_package_id' => 'Paket sedang tidak aktif.']);
            }

            if (($package->registration_open_date && $package->registration_open_date->isFuture())
                || ($package->registration_close_date && $package->registration_close_date->isPast())) {
                throw ValidationException::withMessages(['umrah_package_id' => 'Periode registrasi paket sedang ditutup.']);
            }

            if ($package->availableSeats() < 1) {
                throw ValidationException::withMessages(['umrah_package_id' => 'Paket sudah penuh.']);
            }

            $jamaah = Jamaah::create(Arr::except($data, ['umrah_package_id']));
            $sequence = RegistrationSequence::firstOrCreate(
                ['year' => now()->year, 'month' => now()->month],
                ['last_number' => 0],
            );
            $sequence = RegistrationSequence::query()->lockForUpdate()->findOrFail($sequence->id);
            $sequence->increment('last_number');

            $registration = PackageRegistration::create([
                'registration_number' => sprintf('JMH/%d/%02d/%06d', now()->year, now()->month, $sequence->last_number),
                'jamaah_id' => $jamaah->id,
                'umrah_package_id' => $package->id,
                'seat_count' => 1,
                'status' => RegistrationStatus::Registered,
                'registered_at' => now(),
            ]);

            $this->activityLogger->log('jamaah_registered', $registration, $user, ['jamaah_id' => $jamaah->id]);

            return $jamaah->load('registrations.package');
        });
    }
}
