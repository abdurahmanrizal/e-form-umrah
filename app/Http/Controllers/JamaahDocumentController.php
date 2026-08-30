<?php

namespace App\Http\Controllers;

use App\Actions\Document\StoreJamaahDocumentAction;
use App\DocumentStatus;
use App\Http\Requests\ReviewJamaahDocumentRequest;
use App\Http\Requests\UploadJamaahDocumentRequest;
use App\Models\DocumentType;
use App\Models\Jamaah;
use App\Models\JamaahDocument;
use App\Models\UmrahPackage;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JamaahDocumentController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', JamaahDocument::class);

        $documentTypes = DocumentType::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'is_required_default']);
        $documents = Jamaah::query()
            ->with(['latestRegistration.package:id,name,departure_date,return_date', 'documents.documentType:id,name'])
            ->when($request->string('search')->trim()->isNotEmpty(), fn ($query) => $query->where('full_name', 'like', '%'.$request->string('search')->trim().'%'))
            ->when($request->filled('package_id'), fn ($query) => $query->whereHas('latestRegistration', fn ($query) => $query->where('umrah_package_id', $request->integer('package_id'))))
            ->when($request->string('status')->toString() === 'review', fn ($query) => $query->whereHas('documents', fn ($query) => $query->where('status', DocumentStatus::UnderReview)))
            ->when($request->string('status')->toString() === 'incomplete', fn ($query) => $query->whereDoesntHave('documents')->orWhereHas('documents', fn ($query) => $query->whereIn('status', [DocumentStatus::Rejected, DocumentStatus::Missing])))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(function (Jamaah $jamaah) use ($documentTypes): array {
                $documentsByType = $jamaah->documents->keyBy('document_type_id');
                $requiredTypes = $documentTypes->where('is_required_default', true);

                return [
                    'id' => $jamaah->id,
                    'name' => $jamaah->full_name,
                    'registration_number' => $jamaah->latestRegistration?->registration_number,
                    'package_name' => $jamaah->latestRegistration?->package?->name,
                    'departure_date' => $jamaah->latestRegistration?->package?->departure_date?->format('d M Y'),
                    'return_date' => $jamaah->latestRegistration?->package?->return_date?->format('d M Y'),
                    'documents' => $documentTypes->map(function (DocumentType $type) use ($documentsByType): array {
                        $document = $documentsByType->get($type->id);

                        return [
                            'id' => $document?->id,
                            'type' => $type->name,
                            'required' => $type->is_required_default,
                            'status' => $document?->status->value ?? DocumentStatus::Missing->value,
                            'original_name' => $document?->original_name,
                            'expiry_date' => $document?->expiry_date?->toDateString(),
                        ];
                    })->values(),
                    'required_total' => $requiredTypes->count(),
                    'required_verified' => $requiredTypes->filter(fn (DocumentType $type): bool => $documentsByType->get($type->id)?->status === DocumentStatus::Verified)->count(),
                ];
            });

        $selectedJamaah = $request->filled('jamaah_id')
            ? Jamaah::query()->with(['documents.documentType:id,name'])->find($request->integer('jamaah_id'))
            : null;

        return Inertia::render('documents/index', [
            'jamaah' => $documents,
            'filters' => $request->only('search', 'status', 'package_id'),
            'packageOptions' => UmrahPackage::query()->orderBy('departure_date')->get(['id', 'name']),
            'stats' => [
                'review' => JamaahDocument::query()->where('status', DocumentStatus::UnderReview)->count(),
                'rejected' => JamaahDocument::query()->where('status', DocumentStatus::Rejected)->count(),
                'verified' => JamaahDocument::query()->where('status', DocumentStatus::Verified)->count(),
            ],
            'documentTypes' => $documentTypes,
            'selectedJamaah' => $selectedJamaah ? [
                'id' => $selectedJamaah->id,
                'name' => $selectedJamaah->full_name,
                'documents' => $selectedJamaah->documents->map(fn (JamaahDocument $document): array => [
                    'type' => $document->documentType->name,
                    'status' => $document->status->value,
                ]),
            ] : null,
            'canReview' => $request->user()?->role->canManageDocuments() ?? false,
        ]);
    }

    public function store(UploadJamaahDocumentRequest $request, Jamaah $jamaah, StoreJamaahDocumentAction $action): RedirectResponse
    {
        $action->execute($jamaah, $request->validated(), $request->user());

        return back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function review(ReviewJamaahDocumentRequest $request, JamaahDocument $jamaahDocument, ActivityLogger $logger): RedirectResponse
    {
        $status = DocumentStatus::from($request->validated('status'));
        $jamaahDocument->update([
            'status' => $status,
            'note' => $request->validated('note'),
            'verified_at' => $status === DocumentStatus::Verified ? now() : null,
            'verified_by' => $status === DocumentStatus::Verified ? $request->user()->id : null,
        ]);
        $logger->log($status === DocumentStatus::Verified ? 'jamaah_document_verified' : 'jamaah_document_rejected', $jamaahDocument, $request->user());

        return back()->with('success', 'Status dokumen berhasil diperbarui.');
    }

    public function download(JamaahDocument $jamaahDocument): StreamedResponse
    {
        Gate::authorize('view', $jamaahDocument);

        return Storage::disk('local')->download($jamaahDocument->storage_path, $jamaahDocument->original_name);
    }
}
