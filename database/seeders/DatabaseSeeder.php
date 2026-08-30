<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use App\Models\Facility;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = collect([
            ['name' => 'Kelola fasilitas', 'slug' => 'facilities.manage', 'group' => 'Operasional'],
            ['name' => 'Kelola user', 'slug' => 'users.manage', 'group' => 'Administrasi'],
            ['name' => 'Kelola role', 'slug' => 'roles.manage', 'group' => 'Administrasi'],
            ['name' => 'Kelola permission', 'slug' => 'permissions.manage', 'group' => 'Administrasi'],
            ['name' => 'Kelola paket umrah', 'slug' => 'packages.manage', 'group' => 'Operasional'],
            ['name' => 'Kelola jamaah', 'slug' => 'jamaah.manage', 'group' => 'Operasional'],
            ['name' => 'Kelola dokumen', 'slug' => 'documents.manage', 'group' => 'Operasional'],
            ['name' => 'Akses log viewer', 'slug' => 'log.viewer', 'group' => 'Administrasi'],
        ])->map(fn (array $permission) => Permission::query()->updateOrCreate(['slug' => $permission['slug']], $permission));

        $roles = collect([
            ['name' => 'Super Admin', 'slug' => 'super_admin', 'description' => 'Akses penuh aplikasi.'],
            ['name' => 'Admin Umrah', 'slug' => 'admin_umrah', 'description' => 'Mengelola operasional umrah.'],
            ['name' => 'Manager', 'slug' => 'manager', 'description' => 'Memantau operasional.'],
            ['name' => 'Petugas Dokumen', 'slug' => 'document_officer', 'description' => 'Memproses dokumen jamaah.'],
            ['name' => 'Viewer', 'slug' => 'viewer', 'description' => 'Akses baca.'],
        ])->mapWithKeys(function (array $data) use ($permissions): array {
            $role = Role::query()->updateOrCreate(['slug' => $data['slug']], $data);
            $role->permissions()->sync($data['slug'] === 'super_admin' ? $permissions->pluck('id') : []);

            return [$role->slug => $role];
        });

        User::factory()->create([
            'name' => 'Admin Umrah',
            'email' => 'admin@example.com',
            'role' => UserRole::SuperAdmin,
            'role_id' => $roles['super_admin']->id,
        ]);

        collect([
            ['code' => 'TICKET-PP', 'name' => 'Tiket pesawat PP'],
            ['code' => 'VISA', 'name' => 'Visa umrah'],
            ['code' => 'HOTEL-MAKKAH', 'name' => 'Hotel Makkah'],
            ['code' => 'HOTEL-MADINAH', 'name' => 'Hotel Madinah'],
            ['code' => 'MEALS', 'name' => 'Makan 3x sehari'],
            ['code' => 'TRANSPORT', 'name' => 'Transportasi'],
            ['code' => 'MANASIK', 'name' => 'Manasik'],
            ['code' => 'TOUR-LEADER', 'name' => 'Tour leader'],
        ])->each(fn (array $facility) => Facility::query()->create([...$facility, 'is_active' => true]));

        collect([
            ['code' => 'PASSPORT', 'name' => 'Passport', 'required' => true, 'expiry' => true],
            ['code' => 'KTP', 'name' => 'KTP', 'required' => true, 'expiry' => false],
            ['code' => 'KK', 'name' => 'Kartu Keluarga', 'required' => true, 'expiry' => false],
            ['code' => 'PHOTO', 'name' => 'Pas Foto', 'required' => true, 'expiry' => false],
            ['code' => 'MARRIAGE', 'name' => 'Buku Nikah', 'required' => false, 'expiry' => false],
            ['code' => 'VACCINE', 'name' => 'Sertifikat Vaksin', 'required' => false, 'expiry' => false],
        ])->each(fn (array $type) => DocumentType::query()->create([
            'code' => $type['code'],
            'name' => $type['name'],
            'is_required_default' => $type['required'],
            'requires_expiry_date' => $type['expiry'],
            'allowed_extensions' => ['pdf', 'jpg', 'jpeg', 'png'],
            'max_file_size_kb' => 5120,
            'is_active' => true,
        ]));
    }
}
