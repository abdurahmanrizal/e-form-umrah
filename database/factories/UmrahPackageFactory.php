<?php

namespace Database\Factories;

use App\Models\UmrahPackage;
use App\PackageStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UmrahPackage>
 */
class UmrahPackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->bothify('UMR-####-???'),
            'name' => fake()->randomElement(['Syawal Plus Thaif', 'Dzulqaidah Hemat', 'Muharram Premium']),
            'departure_date' => today()->addMonths(2),
            'return_date' => today()->addMonths(2)->addDays(10),
            'total_seats' => 40,
            'price' => 32_500_000,
            'status' => PackageStatus::Draft,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (): array => ['status' => PackageStatus::Active, 'activated_at' => now()]);
    }
}
