<?php

namespace App\Actions\Jamaah;

use App\Models\Jamaah;
use App\Models\PackageRegistration;
use App\Models\RegistrationPackageHistory;
use App\Models\UmrahPackage;
use App\Models\User;
use App\PackageStatus;
use App\RegistrationStatus;
use App\Support\ActivityLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ChangeJamaahPackageAction
{
    public function __construct(private ActivityLogger $activityLogger) {}

    public function execute(Jamaah $jamaah, int $destinationPackageId, string $reason, User $user): PackageRegistration
    {
        return DB::transaction(function () use ($jamaah, $destinationPackageId, $reason, $user): PackageRegistration {
            $registration = PackageRegistration::query()
                ->whereBelongsTo($jamaah)
                ->where('status', '!=', RegistrationStatus::Cancelled)
                ->lockForUpdate()
                ->latest('id')
                ->firstOrFail();

            if ($registration->umrah_package_id === $destinationPackageId) {
                throw ValidationException::withMessages(['umrah_package_id' => 'Paket tujuan harus berbeda dari paket saat ini.']);
            }

            UmrahPackage::query()
                ->whereIn('id', [$registration->umrah_package_id, $destinationPackageId])
                ->orderBy('id')
                ->lockForUpdate()
                ->get();
            $destination = UmrahPackage::query()->findOrFail($destinationPackageId);

            if ($destination->status !== PackageStatus::Active) {
                throw ValidationException::withMessages(['umrah_package_id' => 'Paket tujuan sedang tidak aktif.']);
            }

            if ($destination->availableSeats() < $registration->seat_count) {
                throw ValidationException::withMessages(['umrah_package_id' => 'Paket tujuan sudah penuh.']);
            }

            $fromPackageId = $registration->umrah_package_id;
            $registration->update(['umrah_package_id' => $destination->id]);
            RegistrationPackageHistory::create([
                'package_registration_id' => $registration->id,
                'from_package_id' => $fromPackageId,
                'to_package_id' => $destination->id,
                'changed_by' => $user->id,
                'reason' => $reason,
            ]);
            $this->activityLogger->log('jamaah_package_changed', $registration, $user, ['from_package_id' => $fromPackageId, 'to_package_id' => $destination->id, 'reason' => $reason]);

            return $registration->refresh();
        });
    }
}
