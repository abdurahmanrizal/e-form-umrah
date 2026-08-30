<?php

namespace Database\Factories;

use App\Gender;
use App\Models\Jamaah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Jamaah>
 */
class JamaahFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'gender' => fake()->randomElement(Gender::cases()),
            'birth_place' => fake()->city(),
            'birth_date' => fake()->dateTimeBetween('-70 years', '-18 years')->format('Y-m-d'),
            'nik' => fake()->unique()->numerify('################'),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_relationship' => 'Keluarga',
            'emergency_contact_phone' => fake()->phoneNumber(),
        ];
    }
}
