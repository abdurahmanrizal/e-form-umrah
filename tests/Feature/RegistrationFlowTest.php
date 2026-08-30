<?php

use App\Models\Jamaah;
use App\Models\PackageRegistration;
use App\Models\UmrahPackage;
use App\Models\User;
use App\RegistrationStatus;
use Illuminate\Support\Facades\Storage;

function validJamaahPayload(UmrahPackage $package): array
{
    return [
        'full_name' => 'Nur Aisyah Rahmah', 'gender' => 'female',
        'birth_place' => 'Bandung', 'birth_date' => '1990-05-12',
        'nik' => '3273015205900001', 'phone' => '081234567890', 'address' => 'Bandung',
        'emergency_contact_name' => 'Ahmad Rahman', 'emergency_contact_relationship' => 'Suami',
        'emergency_contact_phone' => '081234567891', 'umrah_package_id' => $package->id,
    ];
}

it('registers jamaah into an active package and allocates one seat', function () {
    $user = User::factory()->create();
    $package = UmrahPackage::factory()->active()->create(['total_seats' => 2]);

    $response = $this->actingAs($user)->post(route('jamaah.store'), validJamaahPayload($package));

    $registration = PackageRegistration::query()->sole();
    $response->assertRedirect(route('documents.index', ['jamaah_id' => $registration->jamaah_id]));
    expect($registration->registration_number)->toStartWith('JMH/')->and($registration->seat_count)->toBe(1)->and($package->availableSeats())->toBe(1);
});

it('allows guests to submit the public jamaah registration form', function () {
    $package = UmrahPackage::factory()->active()->create(['total_seats' => 2]);

    $response = $this->post(route('public.jamaah.store'), validJamaahPayload($package));

    $response->assertRedirect(route('public.jamaah.create'));
    expect(Jamaah::query()->count())->toBe(1)->and(PackageRegistration::query()->count())->toBe(1);
});

it('stores the jamaah signature via the dedicated signing page', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $registration = PackageRegistration::factory()->for(UmrahPackage::factory()->create(), 'package')->create();
    $jamaah = $registration->jamaah;

    $this->actingAs($user)->get(route('jamaah.sign-akad', $jamaah))->assertOk();

    $this->actingAs($user)->patch(route('jamaah.signature', $jamaah), [
        'signature' => 'data:image/png;base64,'.base64_encode('signature'),
    ])->assertRedirect();

    expect($jamaah->refresh()->signature_path)->not->toBeNull()
        ->and($jamaah->signature_signed_at)->not->toBeNull();
    Storage::disk('local')->assertExists($jamaah->signature_path);
});

it('exports an akad pdf for a registered jamaah', function () {
    $user = User::factory()->create();
    $package = UmrahPackage::factory()->create(['name' => 'Paket Akad']);
    $registration = PackageRegistration::factory()->for($package, 'package')->create();

    $response = $this->actingAs($user)->get(route('jamaah.akad', $registration->jamaah));

    $response->assertOk()->assertHeader('content-type', 'application/pdf');
});

it('rejects registration when the package is full', function () {
    $user = User::factory()->create();
    $package = UmrahPackage::factory()->active()->create(['total_seats' => 1]);
    PackageRegistration::factory()->for($package, 'package')->create();

    $response = $this->actingAs($user)->post(route('jamaah.store'), validJamaahPayload($package));

    $response->assertSessionHasErrors('umrah_package_id');
    expect(Jamaah::query()->count())->toBe(1);
});

it('cancels a registration and releases its seat', function () {
    $user = User::factory()->create();
    $package = UmrahPackage::factory()->active()->create(['total_seats' => 1]);
    $registration = PackageRegistration::factory()->for($package, 'package')->create();

    $this->actingAs($user)->patch(route('jamaah.cancel', $registration->jamaah), ['reason' => 'Jamaah mengundurkan diri'])->assertRedirect();

    expect($registration->refresh()->status)->toBe(RegistrationStatus::Cancelled)->and($package->availableSeats())->toBe(1);
});

it('moves a registration to another available package and records history', function () {
    $user = User::factory()->create();
    $origin = UmrahPackage::factory()->active()->create();
    $destination = UmrahPackage::factory()->active()->create();
    $registration = PackageRegistration::factory()->for($origin, 'package')->create();

    $this->actingAs($user)->patch(route('jamaah.package.change', $registration->jamaah), [
        'umrah_package_id' => $destination->id, 'reason' => 'Permintaan perubahan jadwal',
    ])->assertRedirect();

    expect($registration->refresh()->umrah_package_id)->toBe($destination->id);
    $this->assertDatabaseHas('registration_package_histories', ['package_registration_id' => $registration->id, 'from_package_id' => $origin->id, 'to_package_id' => $destination->id]);
});

it('filters jamaah by package and registration status', function () {
    $user = User::factory()->create();
    $selectedPackage = UmrahPackage::factory()->active()->create(['name' => 'Paket Terpilih']);
    $otherPackage = UmrahPackage::factory()->active()->create(['name' => 'Paket Lain']);
    $selectedRegistration = PackageRegistration::factory()->for($selectedPackage, 'package')->create([
        'status' => RegistrationStatus::Confirmed,
    ]);
    PackageRegistration::factory()->for($otherPackage, 'package')->create([
        'status' => RegistrationStatus::Registered,
    ]);

    $response = $this->actingAs($user)->get(route('jamaah.index', [
        'package_id' => $selectedPackage->id,
        'registration_status' => RegistrationStatus::Confirmed->value,
    ]));

    $response->assertOk()
        ->assertSee($selectedRegistration->jamaah->full_name)
        ->assertDontSee(PackageRegistration::query()->where('umrah_package_id', $otherPackage->id)->firstOrFail()->jamaah->full_name);
});
