<?php

namespace App\Http\Controllers;

use App\Actions\Jamaah\RegisterJamaahAction;
use App\DocumentStatus;
use App\Http\Requests\StoreJamaahRequest;
use App\Http\Requests\UpdateJamaahRequest;
use App\Models\DocumentType;
use App\Models\GeneralSetting;
use App\Models\Jamaah;
use App\Models\UmrahPackage;
use App\RegistrationStatus;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class JamaahController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Jamaah::class);

        $requiredDocumentTypeIds = DocumentType::query()
            ->where('is_active', true)
            ->where('is_required_default', true)
            ->pluck('id');

        $jamaah = Jamaah::query()
            ->with(['latestRegistration.package:id,name,departure_date', 'documents:id,jamaah_id,document_type_id,status'])
            ->when($request->string('search')->trim()->isNotEmpty(), function ($query) use ($request): void {
                $search = '%'.$request->string('search')->trim().'%';
                $query->where(fn ($query) => $query->where('full_name', 'like', $search)->orWhere('nik', 'like', $search)->orWhere('passport_number', 'like', $search)->orWhere('phone', 'like', $search)->orWhereHas('registrations', fn ($query) => $query->where('registration_number', 'like', $search)));
            })
            ->when($request->filled('package_id'), fn ($query) => $query->whereHas('latestRegistration', fn ($query) => $query->where('umrah_package_id', $request->integer('package_id'))))
            ->when($request->filled('registration_status'), fn ($query) => $query->whereHas('latestRegistration', fn ($query) => $query->where('status', $request->string('registration_status'))))
            ->when($request->string('document_state')->toString() === 'verified', fn ($query) => $query->whereHas('documents')->whereDoesntHave('documents', fn ($query) => $query->where('status', '!=', DocumentStatus::Verified)))
            ->when($request->string('document_state')->toString() === 'incomplete', fn ($query) => $query->where(fn ($query) => $query->whereDoesntHave('documents')->orWhereHas('documents', fn ($query) => $query->where('status', '!=', DocumentStatus::Verified))))
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(function (Jamaah $jamaah) use ($requiredDocumentTypeIds): array {
                $requiredTotal = $requiredDocumentTypeIds->count();
                $requiredVerified = $jamaah->documents
                    ->where('status', DocumentStatus::Verified)
                    ->whereIn('document_type_id', $requiredDocumentTypeIds)
                    ->pluck('document_type_id')
                    ->unique()
                    ->count();

                return [
                    'id' => $jamaah->id,
                    'full_name' => $jamaah->full_name,
                    'nik' => $jamaah->nik,
                    'passport_number' => $jamaah->passport_number,
                    'phone' => $jamaah->phone,
                    'registration_number' => $jamaah->latestRegistration?->registration_number,
                    'registration_status' => $jamaah->latestRegistration?->status->value,
                    'package_name' => $jamaah->latestRegistration?->package?->name,
                    'document_completion' => $requiredTotal > 0 ? (int) round(($requiredVerified / $requiredTotal) * 100) : 0,
                    'required_verified' => $requiredVerified,
                    'required_total' => $requiredTotal,
                ];
            });

        return Inertia::render('jamaah/index', [
            'jamaah' => $jamaah,
            'filters' => $request->only('search', 'package_id', 'registration_status', 'document_state'),
            'packageOptions' => UmrahPackage::query()->orderBy('departure_date')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Jamaah::class);

        $packages = UmrahPackage::query()
            ->availableForRegistration()
            ->with('facilities:id,name')
            ->withSum(['registrations as used_seats' => fn ($query) => $query->where('status', '!=', RegistrationStatus::Cancelled)], 'seat_count')
            ->orderBy('departure_date')
            ->get()
            ->map(fn (UmrahPackage $package): array => [
                'id' => $package->id,
                'name' => $package->name,
                'departure_date' => $package->departure_date->toDateString(),
                'return_date' => $package->return_date->toDateString(),
                'available_seats' => max(0, $package->total_seats - (int) $package->used_seats),
                'facilities' => $package->facilities->pluck('name'),
            ])
            ->filter(fn (array $package): bool => $package['available_seats'] > 0)
            ->values();

        return Inertia::render('jamaah/create', ['packages' => $packages]);
    }

    public function store(StoreJamaahRequest $request, RegisterJamaahAction $action): RedirectResponse
    {
        $jamaah = $action->execute($request->validated(), $request->user());

        return to_route('documents.index', ['jamaah_id' => $jamaah->id])
            ->with('success', 'Jamaah berhasil didaftarkan. Lengkapi dokumen pendukung.');
    }

    public function edit(Jamaah $jamaah): Response
    {
        Gate::authorize('update', $jamaah);

        return Inertia::render('jamaah/edit', [
            'jamaah' => $jamaah->only([
                'id', 'full_name', 'gender', 'birth_place', 'birth_date', 'nik', 'passport_number',
                'passport_issue_date', 'passport_expiry_date', 'passport_issuing_office', 'phone', 'email',
                'address', 'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone',
                'emergency_contact_address', 'blood_type', 'medical_notes', 'special_assistance',
                'wheelchair_required', 'dietary_notes', 'internal_notes', 'jamaah_notes',
            ]),
        ]);
    }

    public function update(UpdateJamaahRequest $request, Jamaah $jamaah): RedirectResponse
    {
        $jamaah->update($request->validated());

        return to_route('jamaah.index')->with('success', 'Data jamaah berhasil diperbarui.');
    }

    public function publicCreate(): Response
    {
        $packages = UmrahPackage::query()
            ->availableForRegistration()
            ->withSum(['registrations as used_seats' => fn ($query) => $query->where('status', '!=', RegistrationStatus::Cancelled)], 'seat_count')
            ->orderBy('departure_date')
            ->get()
            ->map(fn (UmrahPackage $package): array => [
                'id' => $package->id,
                'name' => $package->name,
                'departure_date' => $package->departure_date->toDateString(),
                'return_date' => $package->return_date->toDateString(),
                'available_seats' => max(0, $package->total_seats - (int) $package->used_seats),
            ])
            ->filter(fn (array $package): bool => $package['available_seats'] > 0)
            ->values();

        return Inertia::render('public-jamaah', ['packages' => $packages]);
    }

    public function publicStore(StoreJamaahRequest $request, RegisterJamaahAction $action): RedirectResponse
    {
        $action->execute($request->validated(), null);

        return to_route('public.jamaah.create')->with('success', 'Pendaftaran berhasil dikirim. Tim kami akan menghubungi Anda.');
    }

    public function signAkad(Jamaah $jamaah): Response
    {
        Gate::authorize('view', $jamaah);
        $jamaah->load(['latestRegistration.package']);

        return Inertia::render('jamaah/sign-akad', [
            'jamaah' => [
                'id' => $jamaah->id,
                'full_name' => $jamaah->full_name,
                'nik' => $jamaah->nik,
                'passport_number' => $jamaah->passport_number,
                'phone' => $jamaah->phone,
                'registration_number' => $jamaah->latestRegistration?->registration_number,
                'package_name' => $jamaah->latestRegistration?->package?->name,
                'departure_date' => $jamaah->latestRegistration?->package?->departure_date?->toDateString(),
                'has_signature' => (bool) $jamaah->signature_path,
            ],
        ]);
    }

    public function storeSignature(Request $request, Jamaah $jamaah): RedirectResponse
    {
        Gate::authorize('update', $jamaah);

        $data = $request->validate([
            'signature' => ['required', 'string', 'regex:/^data:image\/png;base64,/', 'max:2097152'],
        ]);
        $signatureBinary = base64_decode(str_replace('data:image/png;base64,', '', $data['signature']), true);

        abort_unless($signatureBinary !== false, 422, 'Tanda tangan tidak valid.');

        if ($jamaah->signature_path) {
            Storage::disk('local')->delete($jamaah->signature_path);
        }

        $path = 'signatures/'.$jamaah->uuid.'.png';
        Storage::disk('local')->put($path, $signatureBinary);
        $jamaah->update(['signature_path' => $path, 'signature_signed_at' => now()]);

        return back()->with('success', 'Tanda tangan berhasil disimpan.');
    }

    public function show(Jamaah $jamaah): Response
    {
        Gate::authorize('view', $jamaah);
        $jamaah->load(['latestRegistration.package.facilities', 'documents.documentType', 'registrations.histories']);

        return Inertia::render('jamaah/show', ['jamaah' => $jamaah]);
    }

    public function akad(Jamaah $jamaah): HttpResponse
    {
        Gate::authorize('view', $jamaah);
        $jamaah->load(['latestRegistration.package.facilities', 'latestRegistration']);

        abort_unless($jamaah->latestRegistration?->package !== null, 404, 'Paket jamaah belum tersedia.');

        $registration = $jamaah->latestRegistration;
        $package = $registration->package;
        $settings = GeneralSetting::query()->first();

        return Pdf::loadView('pdf.akad', [
            'jamaah' => $jamaah,
            'registration' => $registration,
            'package' => $package,
            'logoPath' => public_path('logo-pdf.png'),
            'headerOrnamentPath' => public_path('akad-header-ornament.svg'),
            'signaturePath' => $jamaah->signature_path ? storage_path('app/private/'.$jamaah->signature_path) : null,
            'settings' => [
                'company_name' => $settings?->company_name ?? 'PT. SETIA AMANAH UMMAT',
                'company_address' => $settings?->company_address ?? 'Jl. Raya Kaligawe Km. 4, Genuk Semarang (Ruko Sultan Agung) 50112',
                'company_email' => $settings?->company_email ?? 'tourtravel.sultanagung@gmail.com',
                'company_phone' => $settings?->company_phone ?? '024-6595106 / 0822-4167-2224',
                'manager_name' => $settings?->manager_name ?? 'Bayu Susantio',
                'manager_title' => $settings?->manager_title ?? 'Manajer Umroh',
                'default_dp' => $settings?->default_dp,
            ],
            'managerSignaturePath' => $settings?->manager_signature_path ? storage_path('app/private/'.$settings->manager_signature_path) : null,
        ])->setPaper('a4')->download(sprintf('Akad-%s-%s.pdf', Str::slug($registration->registration_number), Str::slug($jamaah->full_name)));
    }
}
