<?php

namespace App\Http\Controllers;

use App\Actions\Package\CreateUmrahPackageAction;
use App\Actions\Package\UpdateUmrahPackageAction;
use App\Http\Requests\StoreUmrahPackageRequest;
use App\Http\Requests\UpdateUmrahPackageRequest;
use App\Models\Facility;
use App\Models\UmrahPackage;
use App\PackageStatus;
use App\RegistrationStatus;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UmrahPackageController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', UmrahPackage::class);

        $packages = UmrahPackage::query()
            ->withSum(['registrations as used_seats' => fn ($query) => $query->where('status', '!=', RegistrationStatus::Cancelled)], 'seat_count')
            ->when($request->string('search')->trim()->isNotEmpty(), fn ($query) => $query->where(fn ($query) => $query->where('name', 'like', '%'.$request->string('search')->trim().'%')->orWhere('code', 'like', '%'.$request->string('search')->trim().'%')))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->orderBy('departure_date')
            ->paginate(25)
            ->withQueryString()
            ->through(fn (UmrahPackage $package): array => [
                'id' => $package->id,
                'code' => $package->code,
                'name' => $package->name,
                'departure_date' => $package->departure_date->format('d M Y'),
                'total_seats' => $package->total_seats,
                'used_seats' => (int) $package->used_seats,
                'available_seats' => max(0, $package->total_seats - (int) $package->used_seats),
                'occupancy' => $package->total_seats > 0 ? (int) round(((int) $package->used_seats / $package->total_seats) * 100) : 0,
                'status' => $package->status->value,
            ]);

        return Inertia::render('packages/index', ['packages' => $packages, 'filters' => $request->only('search', 'status')]);
    }

    public function create(): Response
    {
        Gate::authorize('create', UmrahPackage::class);

        return Inertia::render('packages/create', [
            'facilities' => Facility::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreUmrahPackageRequest $request, CreateUmrahPackageAction $action): RedirectResponse
    {
        $action->execute($request->validated(), $request->user());

        return to_route('packages.index')->with('success', 'Paket berhasil dibuat.');
    }

    public function edit(UmrahPackage $umrahPackage): Response
    {
        Gate::authorize('update', $umrahPackage);
        $umrahPackage->load('facilities:id,name');

        return Inertia::render('packages/edit', [
            'package' => [
                ...$umrahPackage->only(['code', 'name', 'description', 'departure_date', 'return_date', 'total_seats', 'price', 'registration_open_date', 'registration_close_date', 'meeting_point', 'airline', 'hotel_makkah', 'hotel_madinah', 'room_type', 'notes', 'status']),
                'departure_date' => $umrahPackage->departure_date->toDateString(),
                'return_date' => $umrahPackage->return_date->toDateString(),
                'registration_open_date' => $umrahPackage->registration_open_date?->toDateString(),
                'registration_close_date' => $umrahPackage->registration_close_date?->toDateString(),
                'price' => $umrahPackage->price,
                'status' => $umrahPackage->status->value,
                'facility_ids' => $umrahPackage->facilities->pluck('id'),
            ],
            'facilities' => Facility::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateUmrahPackageRequest $request, UmrahPackage $umrahPackage, UpdateUmrahPackageAction $action): RedirectResponse
    {
        $action->execute($umrahPackage, $request->validated(), $request->user());

        return to_route('packages.index')->with('success', 'Paket berhasil diperbarui.');
    }

    public function activate(UmrahPackage $umrahPackage, ActivityLogger $logger): RedirectResponse
    {
        Gate::authorize('update', $umrahPackage);

        if ($umrahPackage->total_seats <= 0 || $umrahPackage->return_date->lt($umrahPackage->departure_date) || in_array($umrahPackage->status, [PackageStatus::Cancelled, PackageStatus::Archived], true)) {
            return back()->with('error', 'Paket belum memenuhi syarat aktivasi.');
        }

        $umrahPackage->update(['status' => PackageStatus::Active, 'activated_at' => now()]);
        $logger->log('package_activated', $umrahPackage, request()->user());

        return back()->with('success', 'Paket berhasil diaktifkan.');
    }

    public function deactivate(UmrahPackage $umrahPackage, ActivityLogger $logger): RedirectResponse
    {
        Gate::authorize('update', $umrahPackage);
        $umrahPackage->update(['status' => PackageStatus::Inactive]);
        $logger->log('package_deactivated', $umrahPackage, request()->user());

        return back()->with('success', 'Paket berhasil dinonaktifkan.');
    }
}
