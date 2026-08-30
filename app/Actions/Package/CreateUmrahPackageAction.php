<?php

namespace App\Actions\Package;

use App\Models\UmrahPackage;
use App\Models\User;
use App\PackageStatus;
use App\Support\ActivityLogger;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateUmrahPackageAction
{
    public function __construct(private ActivityLogger $activityLogger) {}

    /** @param array<string, mixed> $data */
    public function execute(array $data, User $user): UmrahPackage
    {
        return DB::transaction(function () use ($data, $user): UmrahPackage {
            if (($data['status'] ?? null) === PackageStatus::Active->value) {
                $data['activated_at'] = now();
            }

            $package = UmrahPackage::create(Arr::except($data, ['facility_ids']));
            $package->facilities()->sync($data['facility_ids'] ?? []);
            $this->activityLogger->log('package_created', $package, $user);

            return $package;
        });
    }
}
