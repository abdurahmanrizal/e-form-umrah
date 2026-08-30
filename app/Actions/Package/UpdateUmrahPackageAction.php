<?php

namespace App\Actions\Package;

use App\Models\UmrahPackage;
use App\Models\User;
use App\PackageStatus;
use App\Support\ActivityLogger;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class UpdateUmrahPackageAction
{
    public function __construct(private ActivityLogger $activityLogger) {}

    /** @param array<string, mixed> $data */
    public function execute(UmrahPackage $package, array $data, User $user): UmrahPackage
    {
        return DB::transaction(function () use ($package, $data, $user): UmrahPackage {
            if (($data['status'] ?? null) === PackageStatus::Active->value && $package->status !== PackageStatus::Active) {
                $data['activated_at'] = now();
            }

            if (($data['status'] ?? null) !== PackageStatus::Active->value) {
                $data['activated_at'] = null;
            }

            $package->update(Arr::except($data, ['facility_ids']));
            $package->facilities()->sync($data['facility_ids'] ?? []);
            $this->activityLogger->log('package_updated', $package, $user);

            return $package;
        });
    }
}
