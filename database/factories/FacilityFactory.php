<?php

namespace Database\Factories;

use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Facility>
 */
class FacilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->lexify('FAC-????'),
            'name' => fake()->unique()->randomElement(['Tiket pesawat PP', 'Visa umrah', 'Hotel Makkah', 'Makan 3x sehari', 'Transportasi']),
            'is_active' => true,
        ];
    }
}
