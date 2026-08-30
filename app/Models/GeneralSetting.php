<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['company_name', 'company_address', 'company_email', 'company_phone', 'manager_name', 'manager_title', 'default_dp', 'manager_signature_path'])]
class GeneralSetting extends Model
{
    protected function casts(): array
    {
        return ['default_dp' => 'decimal:2'];
    }
}
