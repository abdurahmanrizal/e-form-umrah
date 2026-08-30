<?php

use App\Models\Facility;
use App\Models\UmrahPackage;
use App\Models\User;
use App\PackageStatus;
use App\UserRole;

it('creates a draft package with selected facilities', function () {
    $user = User::factory()->create();
    $facility = Facility::factory()->create();

    $response = $this->actingAs($user)->post(route('packages.store'), [
        'name' => 'Ramadan Premium', 'code' => 'UMR-2608-RMD',
        'departure_date' => '2026-10-10', 'return_date' => '2026-10-20',
        'total_seats' => 45, 'status' => 'draft', 'facility_ids' => [$facility->id],
    ]);

    $response->assertRedirect(route('packages.index'));
    $package = UmrahPackage::query()->sole();
    expect($package->status)->toBe(PackageStatus::Draft)->and($package->facilities)->toHaveCount(1);
    $this->assertDatabaseHas('activity_logs', ['event' => 'package_created', 'subject_id' => $package->id]);
});

it('rejects a return date before departure', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('packages.store'), [
        'name' => 'Paket Tidak Valid', 'code' => 'UMR-INVALID',
        'departure_date' => '2026-10-20', 'return_date' => '2026-10-10', 'total_seats' => 40,
        'status' => 'draft',
    ]);

    $response->assertSessionHasErrors('return_date');
    $this->assertDatabaseEmpty('umrah_packages');
});

it('creates an active package with its activation time', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('packages.store'), [
        'name' => 'Syawal Aktif', 'code' => 'UMR-2608-AKT',
        'departure_date' => '2026-10-10', 'return_date' => '2026-10-20',
        'total_seats' => 45, 'status' => 'active',
    ])->assertRedirect(route('packages.index'));

    $package = UmrahPackage::query()->sole();
    expect($package->status)->toBe(PackageStatus::Active)
        ->and($package->activated_at)->not->toBeNull();
});

it('filters packages by search and status', function () {
    $user = User::factory()->create();
    UmrahPackage::factory()->active()->create(['name' => 'Ramadan Premium']);
    UmrahPackage::factory()->create(['name' => 'Syawal Reguler']);

    $response = $this->actingAs($user)->get(route('packages.index', [
        'search' => 'Ramadan', 'status' => 'active',
    ]));

    $response->assertOk()->assertSee('Ramadan Premium')->assertDontSee('Syawal Reguler');
});

it('forbids viewers from creating packages', function () {
    $viewer = User::factory()->create(['role' => UserRole::Viewer]);

    $this->actingAs($viewer)->post(route('packages.store'), [])->assertForbidden();
});

it('activates a valid package', function () {
    $user = User::factory()->create();
    $package = UmrahPackage::factory()->create();

    $this->actingAs($user)->patch(route('packages.activate', $package))->assertRedirect();

    expect($package->refresh()->status)->toBe(PackageStatus::Active);
});
