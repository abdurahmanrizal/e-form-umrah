<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['package_registration_id', 'from_package_id', 'to_package_id', 'changed_by', 'reason'])]
class RegistrationPackageHistory extends Model
{
    /** @return BelongsTo<PackageRegistration, $this> */
    public function registration(): BelongsTo
    {
        return $this->belongsTo(PackageRegistration::class, 'package_registration_id');
    }
}
