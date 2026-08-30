<?php

use App\DocumentStatus;
use App\Models\DocumentType;
use App\Models\Jamaah;
use App\Models\JamaahDocument;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('stores an uploaded jamaah document privately', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $jamaah = Jamaah::factory()->create();
    $type = DocumentType::factory()->create(['allowed_extensions' => ['pdf']]);

    $response = $this->actingAs($user)->post(route('jamaah.documents.store', $jamaah), [
        'document_type_id' => $type->id, 'file' => UploadedFile::fake()->create('passport.pdf', 512, 'application/pdf'),
    ]);

    $response->assertRedirect();
    $document = JamaahDocument::query()->sole();
    Storage::disk('local')->assertExists($document->storage_path);
    expect($document->status)->toBe(DocumentStatus::UnderReview);
});

it('rejects a file type not permitted by the document master', function () {
    Storage::fake('local');
    $user = User::factory()->create();
    $jamaah = Jamaah::factory()->create();
    $type = DocumentType::factory()->create(['allowed_extensions' => ['pdf']]);

    $response = $this->actingAs($user)->post(route('jamaah.documents.store', $jamaah), [
        'document_type_id' => $type->id, 'file' => UploadedFile::fake()->image('passport.jpg'),
    ]);

    $response->assertSessionHasErrors('file');
    $this->assertDatabaseEmpty('jamaah_documents');
});

it('allows a document officer to verify a document', function () {
    $officer = User::factory()->create(['role' => UserRole::DocumentOfficer]);
    $document = JamaahDocument::factory()->create();

    $this->actingAs($officer)->patch(route('documents.review', $document), ['status' => 'verified'])->assertRedirect();

    expect($document->refresh()->status)->toBe(DocumentStatus::Verified)->and($document->verified_by)->toBe($officer->id);
});

it('forbids viewers from reviewing documents', function () {
    $viewer = User::factory()->create(['role' => UserRole::Viewer]);
    $document = JamaahDocument::factory()->create();

    $this->actingAs($viewer)->patch(route('documents.review', $document), ['status' => 'verified'])->assertForbidden();
});
