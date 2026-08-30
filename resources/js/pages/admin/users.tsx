import { Form, Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, PencilLine, ShieldPlus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { PageHeading } from '@/components/operations/page-heading';
import { StatusBadge } from '@/components/operations/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as adminRoutes from '@/routes/admin';
import * as admin from '@/routes/admin/users';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    role_id: number;
    verified: boolean;
};
type Role = { id: number; name: string };

export default function Users({
    users,
    roles,
}: {
    users: { data: User[]; total: number };
    roles: Role[];
}) {
    const [editing, setEditing] = useState<User | null>(null);
    const form = useForm({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    const openEdit = (user: User) => {
        setEditing(user);
        form.clearErrors();
        form.setData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: String(user.role_id ?? ''),
        });
    };

    const submitEdit = () => {
        if (!editing) {
            return;
        }
        form.patch(admin.update(editing.id).url, {
            onSuccess: () => {
                setEditing(null);
                form.reset();
            },
        });
    };

    return (
        <>
            <Head title="User" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Pengguna aplikasi"
                    description="Tentukan siapa yang dapat mengakses aplikasi dan perannya."
                />
                <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
                    <section className="h-fit rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <UserPlus />
                            </span>
                            <div>
                                <h2 className="font-semibold">Tambah user</h2>
                                <p className="text-sm text-muted-foreground">
                                    Undang anggota tim operasional.
                                </p>
                            </div>
                        </div>
                        <Form {...admin.store.form()} className="grid gap-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Nama</Label>
                                        <Input
                                            name="name"
                                            placeholder="Nama lengkap"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Email</Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="nama@perusahaan.com"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Password sementara</Label>
                                        <Input
                                            name="password"
                                            type="password"
                                            placeholder="Minimal 8 karakter"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Role</Label>
                                        <select
                                            name="role_id"
                                            required
                                            className="h-9 rounded-md border bg-background px-3 text-sm"
                                        >
                                            <option value="">Pilih role</option>
                                            {roles.map((role) => (
                                                <option
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button
                                        disabled={processing}
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    >
                                        <ShieldPlus />
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Tambah user'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </section>
                    <section className="overflow-hidden rounded-2xl border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">Akses pengguna</h2>
                            <p className="text-sm text-muted-foreground">
                                {users.total} user terdaftar
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left text-sm">
                                <thead className="bg-muted/50 text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">Pengguna</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">
                                            Verifikasi
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge
                                                    label={user.role}
                                                    tone="confirmed"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                {user.verified ? (
                                                    <StatusBadge
                                                        label="Terverifikasi"
                                                        tone="active"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge
                                                            label="Belum diverifikasi"
                                                            tone="draft"
                                                        />
                                                        <Link
                                                            href={admin.verify(
                                                                user.id,
                                                            )}
                                                            method="patch"
                                                            as="button"
                                                            preserveScroll
                                                            className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
                                                        >
                                                            <CheckCircle2 className="size-3.5" />{' '}
                                                            Verifikasi
                                                        </Link>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEdit(user)
                                                    }
                                                    className="inline-flex items-center gap-2 text-xs font-medium"
                                                >
                                                    <PencilLine className="size-4" />{' '}
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
            <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit user</DialogTitle>
                        <DialogDescription>
                            Perbarui identitas dan peran pengguna.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Nama</Label>
                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                            />
                            {form.errors.name && (
                                <p className="text-xs text-destructive">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                            />
                            {form.errors.email && (
                                <p className="text-xs text-destructive">
                                    {form.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Password baru</Label>
                            <Input
                                type="password"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                placeholder="Kosongkan bila tidak diubah"
                            />
                            {form.errors.password && (
                                <p className="text-xs text-destructive">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Role</Label>
                            <select
                                value={form.data.role_id}
                                onChange={(e) =>
                                    form.setData('role_id', e.target.value)
                                }
                                className="h-9 rounded-md border bg-background px-3 text-sm"
                            >
                                <option value="">Pilih role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {form.errors.role_id && (
                                <p className="text-xs text-destructive">
                                    {form.errors.role_id}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditing(null)}>
                            Batal
                        </Button>
                        <Button
                            disabled={form.processing}
                            onClick={submitEdit}
                            className="bg-emerald-700 text-white hover:bg-emerald-800"
                        >
                            {form.processing ? 'Menyimpan...' : 'Simpan perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
Users.layout = { breadcrumbs: [{ title: 'User', href: adminRoutes.users() }] };