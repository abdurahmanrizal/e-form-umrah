<?php

namespace Database\Factories;

use App\Models\DocumentType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentType>
 */
class DocumentTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->lexify('DOC-????'),
            'name' => fake()->unique()->randomElement(['Passport', 'KTP', 'Kartu Keluarga', 'Pas Foto', 'Buku Nikah']),
            'is_required_default' => true,
            'requires_expiry_date' => false,
            'allowed_extensions' => ['pdf', 'jpg', 'jpeg', 'png'],
            'max_file_size_kb' => 5120,
            'is_active' => true,
        ];
    }
}
