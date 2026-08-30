<?php

namespace App\Actions\Document;

use App\DocumentStatus;
use App\Models\DocumentType;
use App\Models\Jamaah;
use App\Models\JamaahDocument;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreJamaahDocumentAction
{
    public function __construct(private ActivityLogger $activityLogger) {}

    /** @param array<string, mixed> $data */
    public function execute(Jamaah $jamaah, array $data, User $user): JamaahDocument
    {
        $documentType = DocumentType::query()->whereKey($data['document_type_id'])->where('is_active', true)->firstOrFail();
        /** @var UploadedFile $file */
        $file = $data['file'];

        if (! in_array(strtolower($file->extension()), $documentType->allowed_extensions, true)) {
            throw ValidationException::withMessages(['file' => 'Tipe file tidak diizinkan untuk dokumen ini.']);
        }

        if ($file->getSize() > $documentType->max_file_size_kb * 1024) {
            throw ValidationException::withMessages(['file' => 'Dokumen melebihi ukuran maksimum.']);
        }

        if ($documentType->requires_expiry_date && empty($data['expiry_date'])) {
            throw ValidationException::withMessages(['expiry_date' => 'Tanggal kedaluwarsa wajib diisi.']);
        }

        return DB::transaction(function () use ($jamaah, $data, $user, $documentType, $file): JamaahDocument {
            $registration = $jamaah->registrations()->latest('id')->first();
            $path = $file->store('jamaah/'.$jamaah->uuid, 'local');
            $document = JamaahDocument::create([
                ...Arr::except($data, ['file']),
                'jamaah_id' => $jamaah->id,
                'package_registration_id' => $registration?->id,
                'document_type_id' => $documentType->id,
                'storage_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
                'file_size' => $file->getSize(),
                'status' => DocumentStatus::UnderReview,
            ]);
            $this->activityLogger->log('jamaah_document_uploaded', $document, $user);

            return $document;
        });
    }
}
