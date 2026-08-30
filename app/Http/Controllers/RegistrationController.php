<?php

namespace App\Http\Controllers;

use App\Actions\Jamaah\CancelRegistrationAction;
use App\Actions\Jamaah\ChangeJamaahPackageAction;
use App\Http\Requests\CancelRegistrationRequest;
use App\Http\Requests\ChangePackageRequest;
use App\Models\Jamaah;
use Illuminate\Http\RedirectResponse;

class RegistrationController extends Controller
{
    public function changePackage(ChangePackageRequest $request, Jamaah $jamaah, ChangeJamaahPackageAction $action): RedirectResponse
    {
        $action->execute($jamaah, (int) $request->validated('umrah_package_id'), $request->validated('reason'), $request->user());

        return back()->with('success', 'Paket jamaah berhasil dipindahkan.');
    }

    public function cancel(CancelRegistrationRequest $request, Jamaah $jamaah, CancelRegistrationAction $action): RedirectResponse
    {
        $action->execute($jamaah, $request->validated('reason'), $request->user());

        return back()->with('success', 'Registrasi jamaah berhasil dibatalkan.');
    }
}
