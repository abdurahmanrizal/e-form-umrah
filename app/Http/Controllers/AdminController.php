<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFacilityRequest;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateFacilityRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Facility;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    private function authorizeAdmin(): void
    {
        Gate::authorize('admin-panel');
    }

    public function facilities(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('admin/facilities', ['facilities' => Facility::query()->latest()->get()]);
    }

    public function storeFacility(StoreFacilityRequest $request): RedirectResponse
    {
        Facility::query()->create([...$request->validated(), 'is_active' => $request->boolean('is_active', true)]);

        return to_route('admin.facilities')->with('success', 'Fasilitas berhasil ditambahkan.');
    }

    public function toggleFacility(Facility $facility): RedirectResponse
    {
        $this->authorizeAdmin();
        $facility->update(['is_active' => ! $facility->is_active]);

        return back()->with('success', 'Status fasilitas berhasil diperbarui.');
    }

    public function updateFacility(UpdateFacilityRequest $request, Facility $facility): RedirectResponse
    {
        $this->authorizeAdmin();
        $facility->update([...$request->validated(), 'is_active' => $request->boolean('is_active')]);

        return to_route('admin.facilities')->with('success', 'Fasilitas berhasil diperbarui.');
    }

    public function users(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('admin/users', [
            'users' => User::query()->with('assignedRole')->latest()->paginate(20)->through(fn (User $user): array => [
                'id' => $user->id, 'name' => $user->name, 'email' => $user->email,
                'role' => $user->assignedRole?->name ?? str($user->role->value)->headline()->toString(),
                'role_id' => $user->role_id, 'verified' => $user->email_verified_at !== null,
            ]),
            'roles' => Role::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function storeUser(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $role = Role::query()->findOrFail($data['role_id']);
        User::query()->create([...$data, 'role' => UserRole::tryFrom($role->slug) ?? UserRole::Viewer]);

        return to_route('admin.users')->with('success', 'User berhasil ditambahkan.');
    }

    public function verifyUser(User $user): RedirectResponse
    {
        $this->authorizeAdmin();

        if ($user->email_verified_at !== null) {
            return back()->with('warning', 'User sudah terverifikasi.');
        }

        $user->forceFill(['email_verified_at' => now()])->save();

        return back()->with('success', 'User berhasil diverifikasi.');
    }

    public function updateUser(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        $role = Role::query()->findOrFail($data['role_id']);
        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'role_id' => $role->id,
            'role' => UserRole::tryFrom($role->slug) ?? UserRole::Viewer,
        ];

        if (! empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        $user->update($payload);

        return to_route('admin.users')->with('success', 'User berhasil diperbarui.');
    }

    public function roles(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('admin/roles', [
            'roles' => Role::query()->withCount('users')->with('permissions:id,name,slug,group')->latest()->get(),
            'permissions' => Permission::query()->orderBy('group')->orderBy('name')->get(['id', 'name', 'slug', 'group']),
        ]);
    }

    public function storeRole(StoreRoleRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $role = Role::query()->create($data);
        $role->permissions()->sync($data['permission_ids'] ?? []);

        return to_route('admin.roles')->with('success', 'Role berhasil ditambahkan.');
    }

    public function updateRole(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $data = $request->validated();
        $role->update([...$data, 'is_active' => $request->boolean('is_active', true)]);
        $role->permissions()->sync($data['permission_ids'] ?? []);

        return to_route('admin.roles')->with('success', 'Role berhasil diperbarui.');
    }

    public function permissions(): Response
    {
        $this->authorizeAdmin();

        return Inertia::render('admin/permissions', [
            'permissions' => Permission::query()->withCount('roles')->orderBy('group')->orderBy('name')->get(),
        ]);
    }

    public function storePermission(Request $request): RedirectResponse
    {
        $this->authorizeAdmin();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9._-]+$/i', 'unique:permissions,slug'],
            'group' => ['required', 'string', 'max:100'],
        ]);
        Permission::query()->create($data);

        return to_route('admin.permissions')->with('success', 'Permission berhasil ditambahkan.');
    }

    public function updatePermission(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $permission->update($request->validated());

        return to_route('admin.permissions')->with('success', 'Permission berhasil diperbarui.');
    }
}
