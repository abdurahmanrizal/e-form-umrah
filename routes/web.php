<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GeneralSettingController;
use App\Http\Controllers\JamaahController;
use App\Http\Controllers\JamaahDocumentController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\UmrahPackageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
})->name('home');
Route::get('daftar-jamaah', [JamaahController::class, 'publicCreate'])->name('public.jamaah.create');
Route::post('daftar-jamaah', [JamaahController::class, 'publicStore'])->middleware('throttle:10,1')->name('public.jamaah.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('packages', UmrahPackageController::class)
        ->parameters(['packages' => 'umrahPackage'])
        ->only(['index', 'create', 'store', 'edit', 'update']);
    Route::patch('packages/{umrahPackage}/activate', [UmrahPackageController::class, 'activate'])->name('packages.activate');
    Route::patch('packages/{umrahPackage}/deactivate', [UmrahPackageController::class, 'deactivate'])->name('packages.deactivate');

    Route::resource('jamaah', JamaahController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    Route::get('jamaah/{jamaah}/akad', [JamaahController::class, 'akad'])->name('jamaah.akad');
    Route::get('jamaah/{jamaah}/sign-akad', [JamaahController::class, 'signAkad'])->name('jamaah.sign-akad');
    Route::patch('jamaah/{jamaah}/signature', [JamaahController::class, 'storeSignature'])->name('jamaah.signature');
    Route::patch('jamaah/{jamaah}/package', [RegistrationController::class, 'changePackage'])->name('jamaah.package.change');
    Route::patch('jamaah/{jamaah}/cancel', [RegistrationController::class, 'cancel'])->name('jamaah.cancel');

    Route::get('documents', [JamaahDocumentController::class, 'index'])->name('documents.index');
    Route::post('jamaah/{jamaah}/documents', [JamaahDocumentController::class, 'store'])->name('jamaah.documents.store');
    Route::patch('documents/{jamaahDocument}/review', [JamaahDocumentController::class, 'review'])->name('documents.review');
    Route::get('documents/{jamaahDocument}/download', [JamaahDocumentController::class, 'download'])->name('documents.download');

    Route::get('admin/general-settings', [GeneralSettingController::class, 'edit'])->name('admin.general-settings.edit');
    Route::patch('admin/general-settings', [GeneralSettingController::class, 'update'])->name('admin.general-settings.update');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('facilities', [AdminController::class, 'facilities'])->name('facilities');
        Route::post('facilities', [AdminController::class, 'storeFacility'])->name('facilities.store');
        Route::patch('facilities/{facility}', [AdminController::class, 'updateFacility'])->name('facilities.update');
        Route::patch('facilities/{facility}/toggle', [AdminController::class, 'toggleFacility'])->name('facilities.toggle');
        Route::get('users', [AdminController::class, 'users'])->name('users');
        Route::post('users', [AdminController::class, 'storeUser'])->name('users.store');
        Route::patch('users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
        Route::patch('users/{user}/verify', [AdminController::class, 'verifyUser'])->name('users.verify');
        Route::get('roles', [AdminController::class, 'roles'])->name('roles');
        Route::post('roles', [AdminController::class, 'storeRole'])->name('roles.store');
        Route::patch('roles/{role}', [AdminController::class, 'updateRole'])->name('roles.update');
        Route::get('permissions', [AdminController::class, 'permissions'])->name('permissions');
        Route::post('permissions', [AdminController::class, 'storePermission'])->name('permissions.store');
        Route::patch('permissions/{permission}', [AdminController::class, 'updatePermission'])->name('permissions.update');
    });
});

require __DIR__.'/settings.php';
