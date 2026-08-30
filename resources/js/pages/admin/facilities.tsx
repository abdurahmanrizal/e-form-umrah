import { Form, Head, Link, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    CircleOff,
    PencilLine,
    PackagePlus,
    Plus,
} from 'lucide-react';
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
import * as admin from '@/routes/admin/facilities';

type Facility = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    is_active: boolean;
};

export default function Facilities({ facilities }: { facilities: Facility[] }) {
    const [editing, setEditing] = useState<Facility | null>(null);
    const form = useForm({
        code: '',
        name: '',
        description: '',
        is_active: true,
    });

    const openEdit = (item: Facility) => {
        setEditing(item);
        form.clearErrors();
        form.setData({
            code: item.code,
            name: item.name,
            description: item.description ?? '',
            is_active: item.is_active,
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
            <Head title="Fasilitas" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Fasilitas perjalanan"
                    description="Kelola layanan yang dapat ditambahkan ke paket umrah."
                />
                <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
                    <section className="h-fit rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <Plus />
                            </span>
                            <div>
                                <h2 className="font-semibold">
                                    Tambah fasilitas
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Tampilkan layanan baru di paket.
                                </p>
                            </div>
                        </div>
                        <Form {...admin.store.form()} className="grid gap-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="code">Kode</Label>
                                        <Input
                                            id="code"
                                            name="code"
                                            placeholder="HOTEL-MADINAH"
                                        />
                                        {errors.code && (
                                            <p className="text-xs text-destructive">
                                                {errors.code}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Nama fasilitas
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Hotel Madinah"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-destructive">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={3}
                                            className="resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                            placeholder="Keterangan singkat layanan"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            value="1"
                                            defaultChecked
                                            className="size-4 accent-emerald-700"
                                        />{' '}
                                        Aktifkan sekarang
                                    </label>
                                    <Button
                                        disabled={processing}
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    >
                                        <PackagePlus />
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan fasilitas'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </section>
                    <section className="overflow-hidden rounded-2xl border bg-card">
                        <div className="border-b px-5 py-4">
                            <h2 className="font-semibold">Daftar fasilitas</h2>
                            <p className="text-sm text-muted-foreground">
                                {facilities.length} layanan terdaftar
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[620px] text-left text-sm">
                                <thead className="bg-muted/50 text-xs text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">Kode</th>
                                        <th className="px-4 py-3">Fasilitas</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {facilities.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                                                {item.code}
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-medium">
                                                    {item.name}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {item.description ||
                                                        'Tanpa deskripsi'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge
                                                    label={
                                                        item.is_active
                                                            ? 'Aktif'
                                                            : 'Nonaktif'
                                                    }
                                                    tone={
                                                        item.is_active
                                                            ? 'active'
                                                            : 'draft'
                                                    }
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEdit(item)
                                                        }
                                                        className="inline-flex items-center gap-2 text-xs font-medium"
                                                    >
                                                        <PencilLine className="size-4" />{' '}
                                                        Edit
                                                    </Button>
                                                    <Link
                                                        href={admin.toggle(
                                                            item.id,
                                                        )}
                                                        method="patch"
                                                        as="button"
                                                        preserveScroll
                                                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium hover:bg-muted"
                                                    >
                                                        {item.is_active ? (
                                                            <>
                                                                <CircleOff className="size-4" />{' '}
                                                                Nonaktifkan
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="size-4" />{' '}
                                                                Aktifkan
                                                            </>
                                                        )}
                                                    </Link>
                                                </div>
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
                        <DialogTitle>Edit fasilitas</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi layanan ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-code">Kode</Label>
                            <Input
                                id="edit-code"
                                value={form.data.code}
                                onChange={(e) =>
                                    form.setData('code', e.target.value)
                                }
                                placeholder="HOTEL-MADINAH"
                            />
                            {form.errors.code && (
                                <p className="text-xs text-destructive">
                                    {form.errors.code}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama fasilitas</Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="Hotel Madinah"
                            />
                            {form.errors.name && (
                                <p className="text-xs text-destructive">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <textarea
                                id="edit-description"
                                rows={3}
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                className="resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600"
                                placeholder="Keterangan singkat layanan"
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
                            Aktif
                        </label>
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
Facilities.layout = {
    breadcrumbs: [{ title: 'Fasilitas', href: adminRoutes.facilities() }],
};