<?php

namespace Database\Factories;

use App\Models\Jamaah;
use App\Models\PackageRegistration;
use App\Models\UmrahPackage;
use App\RegistrationStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PackageRegistration>
 */
class PackageRegistrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'registration_number' => fake()->unique()->numerify('JMH/2026/08/######'),
            'jamaah_id' => Jamaah::factory(),
            'umrah_package_id' => UmrahPackage::factory()->active(),
            'seat_count' => 1,
            'status' => RegistrationStatus::Registered,
            'registered_at' => now(),
        ];
    }
}
