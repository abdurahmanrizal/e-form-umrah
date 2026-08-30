import { Form, Head, useForm } from '@inertiajs/react';
import { KeyRound, PencilLine, Plus } from 'lucide-react';
import { useState } from 'react';
import { PageHeading } from '@/components/operations/page-heading';
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
import * as admin from '@/routes/admin/roles';

type Permission = { id: number; name: string; slug: string; group: string };
type Role = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active: boolean;
    users_count: number;
    permissions: Permission[];
};

export default function Roles({
    roles,
    permissions,
}: {
    roles: Role[];
    permissions: Permission[];
}) {
    const [editing, setEditing] = useState<Role | null>(null);
    const groups = [...new Set(permissions.map((permission) => permission.group))];
    const form = useForm<{
        name: string;
        slug: string;
        description: string;
        is_active: boolean;
        permission_ids: number[];
    }>({
        name: '',
        slug: '',
        description: '',
        is_active: true,
        permission_ids: [],
    });

    const openEdit = (role: Role) => {
        setEditing(role);
        form.clearErrors();
        form.setData({
            name: role.name,
            slug: role.slug,
            description: role.description ?? '',
            is_active: role.is_active,
            permission_ids: role.permissions.map((permission) => permission.id),
        });
    };

    const togglePermission = (id: number) => {
        form.setData(
            'permission_ids',
            form.data.permission_ids.includes(id)
                ? form.data.permission_ids.filter((item) => item !== id)
                : [...form.data.permission_ids, id],
        );
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
            <Head title="Role" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Role & akses"
                    description="Buat peran kerja dan tentukan permission yang dimilikinya."
                />
                <div className="grid gap-6 lg:grid-cols-[minmax(280px,390px)_1fr]">
                    <section className="h-fit rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <KeyRound />
                            </span>
                            <div>
                                <h2 className="font-semibold">Tambah role</h2>
                                <p className="text-sm text-muted-foreground">
                                    Atur akses sesuai tanggung jawab.
                                </p>
                            </div>
                        </div>
                        <Form {...admin.store.form()} className="grid gap-4">
                            {({ processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Nama role</Label>
                                        <Input
                                            name="name"
                                            placeholder="Supervisor Operasional"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Slug</Label>
                                        <Input
                                            name="slug"
                                            placeholder="supervisor_operasional"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Deskripsi</Label>
                                        <textarea
                                            name="description"
                                            rows={2}
                                            className="resize-none rounded-lg border bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Permission</Label>
                                        {groups.map((group) => (
                                            <div
                                                key={group}
                                                className="grid gap-2"
                                            >
                                                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                    {group}
                                                </p>
                                                {permissions
                                                    .filter(
                                                        (permission) =>
                                                            permission.group ===
                                                            group,
                                                    )
                                                    .map((permission) => (
                                                        <label
                                                            key={permission.id}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                name="permission_ids[]"
                                                                value={
                                                                    permission.id
                                                                }
                                                                className="size-4 accent-emerald-700"
                                                            />
                                                            {permission.name}
                                                        </label>
                                                    ))}
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        disabled={processing}
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    >
                                        <Plus />
                                        Simpan role
                                    </Button>
                                </>
                            )}
                        </Form>
                    </section>
                    <section className="grid content-start gap-3 sm:grid-cols-2">
                        {roles.map((role) => (
                            <article
                                key={role.id}
                                className="rounded-2xl border bg-card p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="font-semibold">
                                            {role.name}
                                        </h2>
                                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                                            {role.slug}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                                            {role.users_count} user
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(role)}
                                            aria-label={`Edit ${role.name}`}
                                        >
                                            <PencilLine className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground">
                                    {role.description || 'Tanpa deskripsi'}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {role.permissions.length === 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            Tanpa permission
                                        </span>
                                    )}
                                    {role.permissions.map((permission) => (
                                        <span
                                            key={permission.id}
                                            className="rounded-md border px-2 py-1 text-xs"
                                        >
                                            {permission.name}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </main>
            <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit role</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi dan permission yang dimiliki role
                            ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Nama role</Label>
                            <Input
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="Supervisor Operasional"
                            />
                            {form.errors.name && (
                                <p className="text-xs text-destructive">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Slug</Label>
                            <Input
                                value={form.data.slug}
                                onChange={(e) =>
                                    form.setData('slug', e.target.value)
                                }
                                placeholder="supervisor_operasional"
                            />
                            {form.errors.slug && (
                                <p className="text-xs text-destructive">
                                    {form.errors.slug}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Deskripsi</Label>
                            <textarea
                                rows={2}
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                className="resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.is_active}
                                onChange={(e) =>
                                    form.setData('is_active', e.target.checked)
                                }
                                className="size-4 accent-emerald-700"
                            />{' '}
                            Role aktif
                        </label>
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <Label>Permission</Label>
                                <span className="text-xs text-muted-foreground">
                                    {form.data.permission_ids.length} dipilih
                                </span>
                            </div>
                            {groups.map((group) => (
                                <div
                                    key={group}
                                    className="rounded-xl border bg-muted/20 p-3"
                                >
                                    <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        {group}
                                    </p>
                                    <div className="grid gap-1.5">
                                        {permissions
                                            .filter(
                                                (permission) =>
                                                    permission.group === group,
                                            )
                                            .map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-background has-[:checked]:bg-emerald-50/60 dark:has-[:checked]:bg-emerald-950/20"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={form.data.permission_ids.includes(
                                                            permission.id,
                                                        )}
                                                        onChange={() =>
                                                            togglePermission(
                                                                permission.id,
                                                            )
                                                        }
                                                        className="size-4 accent-emerald-700"
                                                    />
                                                    <span className="flex-1">
                                                        {permission.name}
                                                    </span>
                                                    <span className="font-mono text-[10px] text-muted-foreground">
                                                        {permission.slug}
                                                    </span>
                                                </label>
                                            ))}
                                    </div>
                                </div>
                            ))}
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
                            {form.processing
                                ? 'Menyimpan...'
                                : 'Simpan perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
Roles.layout = { breadcrumbs: [{ title: 'Role', href: adminRoutes.roles() }] };