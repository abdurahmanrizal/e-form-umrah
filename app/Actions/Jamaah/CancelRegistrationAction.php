<?php

namespace App\Actions\Jamaah;

use App\Models\Jamaah;
use App\Models\PackageRegistration;
use App\Models\User;
use App\RegistrationStatus;
use App\Support\ActivityLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelRegistrationAction
{
    public function __construct(private ActivityLogger $activityLogger) {}

    public function execute(Jamaah $jamaah, string $reason, User $user): PackageRegistration
    {
        return DB::transaction(function () use ($jamaah, $reason, $user): PackageRegistration {
            $registration = PackageRegistration::query()
                ->whereBelongsTo($jamaah)
                ->lockForUpdate()
                ->latest('id')
                ->firstOrFail();

            if ($registration->status === RegistrationStatus::Cancelled) {
                throw ValidationException::withMessages(['reason' => 'Registrasi sudah dibatalkan.']);
            }

            $registration->update([
                'status' => RegistrationStatus::Cancelled,
                'cancelled_at' => now(),
                'cancelled_by' => $user->id,
                'cancellation_reason' => $reason,
            ]);
            $this->activityLogger->log('jamaah_registration_cancelled', $registration, $user, ['reason' => $reason]);

            return $registration;
        });
    }
}
