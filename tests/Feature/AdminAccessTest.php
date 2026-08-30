<?php

use App\Models\Facility;
use App\Models\GeneralSetting;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\Storage;

test('only super admins can access administration menus', function () {
    $this->actingAs(User::factory()->create(['role' => UserRole::AdminUmrah]))
        ->get(route('admin.facilities'))
        ->assertForbidden();

    $this->actingAs(User::factory()->create(['role' => UserRole::SuperAdmin]))
        ->get(route('admin.facilities'))
        ->assertOk();
});

test('super admin can add and toggle facility', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);

    $this->actingAs($user)->post(route('admin.facilities.store'), [
        'code' => 'WIFI',
        'name' => 'Wi-Fi hotel',
        'description' => 'Internet selama perjalanan',
        'is_active' => true,
    ])->assertRedirect(route('admin.facilities'));

    $facility = Facility::query()->where('code', 'WIFI')->firstOrFail();
    $this->actingAs($user)->patch(route('admin.facilities.toggle', $facility))->assertRedirect();
    expect($facility->fresh()->is_active)->toBeFalse();
});

test('role stores selected permissions and can be assigned to user', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $permission = Permission::query()->create(['name' => 'Lihat laporan', 'slug' => 'reports.view', 'group' => 'Laporan']);

    $this->actingAs($user)->post(route('admin.roles.store'), [
        'name' => 'Pelapor',
        'slug' => 'pelapor',
        'permission_ids' => [$permission->id],
    ])->assertRedirect(route('admin.roles'));

    $role = Role::query()->where('slug', 'pelapor')->firstOrFail();
    expect($role->permissions)->toHaveCount(1);

    $this->actingAs($user)->post(route('admin.users.store'), [
        'name' => 'Petugas Laporan',
        'email' => 'laporan@example.com',
        'password' => 'password123',
        'role_id' => $role->id,
    ])->assertRedirect(route('admin.users'));

    expect(User::query()->where('email', 'laporan@example.com')->value('role_id'))->toBe($role->id);
});

test('super admin can verify an unverified user', function () {
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);
    $target = User::factory()->unverified()->create();

    $this->actingAs($user)->patch(route('admin.users.verify', $target))->assertRedirect();

    expect($target->fresh()->email_verified_at)->not->toBeNull();
});

test('super admin can access administration menus', function () {
    $this->actingAs(User::factory()->create(['role' => UserRole::SuperAdmin]))
        ->get(route('admin.facilities'))
        ->assertOk();
});

test('super admin can update general settings and manager signature', function () {
    Storage::fake('local');
    $user = User::factory()->create(['role' => UserRole::SuperAdmin]);

    $this->actingAs($user)->patch(route('admin.general-settings.update'), [
        'company_name' => 'PT Sultan Baru',
        'company_address' => 'Semarang',
        'company_email' => 'admin@sultan.test',
        'company_phone' => '08123456789',
        'manager_name' => 'Amin Rahman',
        'manager_title' => 'Manager Operasional',
        'default_dp' => 5000000,
        'manager_signature' => 'data:image/png;base64,'.base64_encode('manager-signature'),
    ])->assertRedirect(route('admin.general-settings.edit'));

    $settings = GeneralSetting::query()->firstOrFail();
    expect($settings->company_name)->toBe('PT Sultan Baru')
        ->and($settings->manager_name)->toBe('Amin Rahman');
    Storage::disk('local')->assertExists($settings->manager_signature_path);
});
