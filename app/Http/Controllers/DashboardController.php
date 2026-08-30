<?php

namespace App\Http\Controllers;

use App\DocumentStatus;
use App\Models\Jamaah;
use App\Models\JamaahDocument;
use App\Models\PackageRegistration;
use App\Models\UmrahPackage;
use App\PackageStatus;
use App\RegistrationStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $activePackages = UmrahPackage::query()->where('status', PackageStatus::Active);
        $totalSeats = (clone $activePackages)->sum('total_seats');
        $usedSeats = PackageRegistration::query()->where('status', '!=', RegistrationStatus::Cancelled)->whereHas('package', fn ($query) => $query->where('status', PackageStatus::Active))->sum('seat_count');
        $verifiedDocuments = JamaahDocument::query()->where('status', DocumentStatus::Verified)->distinct('jamaah_id')->count('jamaah_id');
        $almostFullPackages = UmrahPackage::query()
            ->where('status', PackageStatus::Active)
            ->withSum(['registrations as used_seats' => fn ($query) => $query->where('status', '!=', RegistrationStatus::Cancelled)], 'seat_count')
            ->get(['id', 'total_seats'])
            ->filter(fn (UmrahPackage $package): bool => $package->total_seats > 0 && (int) $package->used_seats >= $package->total_seats * 0.8)
            ->count();

        $departures = (clone $activePackages)
            ->withSum(['registrations as used_seats' => fn ($query) => $query->where('status', '!=', RegistrationStatus::Cancelled)], 'seat_count')
            ->orderBy('departure_date')
            ->limit(5)
            ->get()
            ->map(fn (UmrahPackage $package): array => [
                'name' => $package->name,
                'date' => $package->departure_date->format('d M Y'),
                'seats' => (int) $package->used_seats.'/'.$package->total_seats,
                'occupancy' => $package->total_seats > 0 ? (int) round(((int) $package->used_seats / $package->total_seats) * 100) : 0,
                'status' => $package->status->value,
            ]);

        return Inertia::render('dashboard', [
            'metrics' => [
                'total_jamaah' => Jamaah::query()->whereNull('archived_at')->count(),
                'active_packages' => (clone $activePackages)->count(),
                'total_seats' => $totalSeats,
                'used_seats' => $usedSeats,
                'available_seats' => max(0, $totalSeats - $usedSeats),
                'verified_jamaah' => $verifiedDocuments,
            ],
            'departures' => $departures,
            'attention' => [
                'documents_review' => JamaahDocument::query()->where('status', DocumentStatus::UnderReview)->count(),
                'missing_passport' => Jamaah::query()->whereNull('passport_number')->count(),
                'almost_full_packages' => $almostFullPackages,
            ],
        ]);
    }
}
