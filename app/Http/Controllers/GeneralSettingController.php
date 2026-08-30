<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateGeneralSettingRequest;
use App\Models\GeneralSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GeneralSettingController extends Controller
{
    public function edit(): Response
    {
        Gate::authorize('admin-panel');

        $settings = GeneralSetting::query()->first();

        return Inertia::render('admin/general-settings', [
            'settings' => $settings ?? [
                'company_name' => 'PT. SETIA AMANAH UMMAT',
                'company_address' => '',
                'company_email' => '',
                'company_phone' => '',
                'manager_name' => 'Bayu Susantio',
                'manager_title' => 'Manajer Umroh',
                'default_dp' => null,
                'has_manager_signature' => false,
            ],
            'hasManagerSignature' => (bool) $settings?->manager_signature_path,
        ]);
    }

    public function update(UpdateGeneralSettingRequest $request): RedirectResponse
    {
        $settings = GeneralSetting::query()->firstOrCreate([], [
            'company_name' => 'PT. SETIA AMANAH UMMAT',
            'manager_name' => 'Bayu Susantio',
            'manager_title' => 'Manajer Umroh',
        ]);
        $data = $request->validated();

        if ($request->filled('manager_signature')) {
            if ($settings->manager_signature_path) {
                Storage::disk('local')->delete($settings->manager_signature_path);
            }

            $signature = base64_decode(str_replace('data:image/png;base64,', '', $data['manager_signature']), true);

            abort_unless($signature !== false, 422, 'Tanda tangan manager tidak valid.');

            $data['manager_signature_path'] = 'settings/manager-signature.png';
            Storage::disk('local')->put($data['manager_signature_path'], $signature);
        }

        unset($data['manager_signature']);
        $settings->update($data);

        return to_route('admin.general-settings.edit')->with('success', 'Pengaturan umum berhasil disimpan.');
    }
}
