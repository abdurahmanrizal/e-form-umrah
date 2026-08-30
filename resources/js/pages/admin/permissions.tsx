import { Form, Head, useForm } from '@inertiajs/react';
import { Key, PencilLine, Plus } from 'lucide-react';
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
import * as admin from '@/routes/admin/permissions';

type Permission = {
    id: number;
    name: string;
    slug: string;
    group: string;
    roles_count: number;
};

export default function Permissions({
    permissions,
}: {
    permissions: Permission[];
}) {
    const [editing, setEditing] = useState<Permission | null>(null);
    const form = useForm({
        name: '',
        slug: '',
        group: '',
    });

    const openEdit = (permission: Permission) => {
        setEditing(permission);
        form.clearErrors();
        form.setData({
            name: permission.name,
            slug: permission.slug,
            group: permission.group,
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
            <Head title="Permission" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Permission"
                    description="Daftar kemampuan yang dapat diberikan kepada setiap role."
                />
                <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
                    <section className="h-fit rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <Key />
                            </span>
                            <div>
                                <h2 className="font-semibold">
                                    Tambah permission
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Definisikan kemampuan baru.
                                </p>
                            </div>
                        </div>
                        <Form {...admin.store.form()} className="grid gap-4">
                            {({ processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Nama</Label>
                                        <Input
                                            name="name"
                                            placeholder="Kelola laporan"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Slug</Label>
                                        <Input
                                            name="slug"
                                            placeholder="reports.manage"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Grup</Label>
                                        <Input
                                            name="group"
                                            placeholder="Operasional"
                                        />
                                    </div>
                                    <Button
                                        disabled={processing}
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    >
                                        <Plus />
                                        Simpan permission
                                    </Button>
                                </>
                            )}
                        </Form>
                    </section>
                    <section className="overflow-hidden rounded-2xl border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">
                                Permission tersedia
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[580px] text-left text-sm">
                                <thead className="bg-muted/50 text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">
                                            Permission
                                        </th>
                                        <th className="px-4 py-3">Grup</th>
                                        <th className="px-4 py-3">
                                            Dipakai role
                                        </th>
                                        <th className="px-5 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {permissions.map((permission) => (
                                        <tr
                                            key={permission.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-medium">
                                                    {permission.name}
                                                </p>
                                                <p className="font-mono text-xs text-muted-foreground">
                                                    {permission.slug}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                {permission.group}
                                            </td>
                                            <td className="px-4 py-4">
                                                {permission.roles_count} role
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEdit(permission)
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
                        <DialogTitle>Edit permission</DialogTitle>
                        <DialogDescription>
                            Perbarui nama, slug, dan grup kemampuan ini.
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
                                placeholder="Kelola laporan"
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
                                placeholder="reports.manage"
                            />
                            {form.errors.slug && (
                                <p className="text-xs text-destructive">
                                    {form.errors.slug}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Grup</Label>
                            <Input
                                value={form.data.group}
                                onChange={(e) =>
                                    form.setData('group', e.target.value)
                                }
                                placeholder="Operasional"
                            />
                            {form.errors.group && (
                                <p className="text-xs text-destructive">
                                    {form.errors.group}
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
Permissions.layout = {
    breadcrumbs: [{ title: 'Permission', href: adminRoutes.permissions() }],
};