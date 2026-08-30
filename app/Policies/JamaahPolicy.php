<?php

namespace App\Policies;

use App\Models\Jamaah;
use App\Models\User;

class JamaahPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Jamaah $jamaah): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role->canManageJamaah();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Jamaah $jamaah): bool
    {
        return $user->role->canManageJamaah();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Jamaah $jamaah): bool
    {
        return $user->role->canManageJamaah();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Jamaah $jamaah): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Jamaah $jamaah): bool
    {
        return false;
    }
}
