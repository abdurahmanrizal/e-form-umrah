<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $last_number
 */
#[Fillable(['year', 'month', 'last_number'])]
class RegistrationSequence extends Model
{
    protected $attributes = ['last_number' => 0];
}
