<?php

use App\Models\Facility;
use App\Models\Jamaah;
use App\Models\Permission;
use App\Models\Role;
use App\Models\UmrahPackage;
use App\Models\User;
use App\UserRole;

it('updates a package and syncs its facilities', function () {
    $user = User::factory()->create();
    $package = UmrahPackage::factory()->create(['name' => 'Paket Lama']);
    $facility = Facility::factory()->create();

    $this->actingAs($user)->patch(route('packages.update', $package), [
        'name' => 'Paket Baru', 'code' => $package->code,
        'departure_date' => '2026-11-01', 'return_date' => '2026-11-11',
        'total_seats' => 50, 'status' => 'draft', 'facility_ids' => [$facility->id],
    ])->assertRedirect(route('packages.index'));

    expect($package->fresh()->name)->toBe('Paket Baru')
        ->and($package->fresh()->facilities)->toHaveCount(1);
    $this->assertDatabaseHas('activity_logs', ['event' => 'package_updated', 'subject_id' => $package->id]);
});

it('rejects duplicate package code on update', function () {
    $user = User::factory()->create();
    $other = UmrahPackage::factory()->create(['code' => 'UMR-OTHER']);
    $package = UmrahPackage::factory()->create();

    $this->actingAs($user)->patch(route('packages.update', $package), [
        'name' => 'Duplikat', 'code' => 'UMR-OTHER',
        'departure_date' => '2026-11-01', 'return_date' => '2026-11-11',
        'total_seats' => 50, 'status' => 'draft',
    ])->assertSessionHasErrors('code');
});

it('updates a jamaah profile', function () {
    $user = User::factory()->create();
    $jamaah = Jamaah::factory()->create();

    $this->actingAs($user)->patch(route('jamaah.update', $jamaah), [
        'full_name' => 'Nama Diperbarui',
        'gender' => $jamaah->gender->value,
        'birth_place' => 'Semarang',
        'birth_date' => '1990-05-05',
        'nik' => '1234567890123456',
        'phone' => '081234567890',
        'address' => 'Jl. Baru No. 1',
        'emergency_contact_name' => 'Ibu',
        'emergency_contact_relationship' => 'Orang tua',
        'emergency_contact_phone' => '081111222333',
    ])->assertRedirect(route('jamaah.index'));

    expect($jamaah->fresh()->full_name)->toBe('Nama Diperbarui');
});

it('updates a facility', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $facility = Facility::factory()->create(['name' => 'Fasilitas Lama']);

    $this->actingAs($user)->patch(route('admin.facilities.update', $facility), [
        'code' => $facility->code, 'name' => 'Fasilitas Baru', 'is_active' => true,
    ])->assertRedirect(route('admin.facilities'));

    expect($facility->fresh()->name)->toBe('Fasilitas Baru');
});

it('updates a user and changes their role', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $target = User::factory()->create(['name' => 'Nama Lama']);
    $role = Role::factory()->create(['name' => 'Petugas Baru', 'slug' => 'petugas_baru']);

    $this->actingAs($user)->patch(route('admin.users.update', $target), [
        'name' => 'Nama Baru',
        'email' => $target->email,
        'role_id' => $role->id,
    ])->assertRedirect(route('admin.users'));

    expect($target->fresh()->name)->toBe('Nama Baru')
        ->and($target->fresh()->role_id)->toBe($role->id);
});

it('updates a role with its permissions', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $role = Role::factory()->create(['name' => 'Role Lama']);
    $permission = Permission::query()->create(['name' => 'Lihat x', 'slug' => 'x.view', 'group' => 'Umum']);

    $this->actingAs($user)->patch(route('admin.roles.update', $role), [
        'name' => 'Role Baru', 'slug' => $role->slug,
        'permission_ids' => [$permission->id],
    ])->assertRedirect(route('admin.roles'));

    expect($role->fresh()->name)->toBe('Role Baru')
        ->and($role->fresh()->permissions)->toHaveCount(1);
});

it('updates a permission', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $permission = Permission::query()->create(['name' => 'Nama Lama', 'slug' => 'old.slug', 'group' => 'Umum']);

    $this->actingAs($user)->patch(route('admin.permissions.update', $permission), [
        'name' => 'Nama Baru', 'slug' => 'new.slug', 'group' => 'Operasional',
    ])->assertRedirect(route('admin.permissions'));

    expect($permission->fresh()->name)->toBe('Nama Baru');
});

it('forbids updating packages by viewers', function () {
    $viewer = User::factory()->create(['role' => UserRole::Viewer]);
    $package = UmrahPackage::factory()->create();

    $this->actingAs($viewer)->patch(route('packages.update', $package), [
        'name' => 'X', 'code' => 'X',
        'departure_date' => '2026-11-01', 'return_date' => '2026-11-11',
        'total_seats' => 50, 'status' => 'draft',
    ])->assertForbidden();
});
