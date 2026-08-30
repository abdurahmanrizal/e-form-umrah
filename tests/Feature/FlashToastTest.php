<?php

use App\Models\User;
use App\UserRole;
use Inertia\Testing\AssertableInertia as Assert;

test('success flash is shared to the next inertia page', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);

    $this->actingAs($user)->patch(route('admin.general-settings.update'), [
        'company_name' => 'PT Test',
        'manager_name' => 'Manager',
        'manager_title' => 'Jabatan',
    ])->assertRedirect(route('admin.general-settings.edit'));

    $this->actingAs($user)->get(route('admin.general-settings.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('flash.toast.type', 'success')
            ->where('flash.toast.message', 'Pengaturan umum berhasil disimpan.'));
});
