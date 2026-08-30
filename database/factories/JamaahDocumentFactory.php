<?php

namespace Database\Factories;

use App\DocumentStatus;
use App\Models\DocumentType;
use App\Models\Jamaah;
use App\Models\JamaahDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JamaahDocument>
 */
class JamaahDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jamaah_id' => Jamaah::factory(),
            'document_type_id' => DocumentType::factory(),
            'storage_path' => 'jamaah/test/document.pdf',
            'original_name' => 'document.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 1024,
            'status' => DocumentStatus::Uploaded,
        ];
    }
}
