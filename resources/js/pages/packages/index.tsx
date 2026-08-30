import { Form, Head, Link } from '@inertiajs/react';
import {
    CircleOff,
    MoreHorizontal,
    PackageOpen,
    PencilLine,
    PlayCircle,
    Plus,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import {
    activate,
    deactivate,
} from '@/actions/App/Http/Controllers/UmrahPackageController';
import { PageHeading } from '@/components/operations/page-heading';
import { Progress } from '@/components/operations/progress';
import { StatusBadge } from '@/components/operations/status-badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import * as packages from '@/routes/packages';

type PackageRow = {
    id: number;
    code: string;
    name: string;
    departure_date: string;
    total_seats: number;
    used_seats: number;
    available_seats: number;
    occupancy: number;
    status: string;
};
type PaginatedPackages = {
    data: PackageRow[];
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
const packageStatuses: Record<
    string,
    { label: string; tone: 'active' | 'draft' | 'full' }
> = {
    active: { label: 'Aktif', tone: 'active' },
    draft: { label: 'Draft', tone: 'draft' },
    inactive: { label: 'Nonaktif', tone: 'draft' },
    full: { label: 'Penuh', tone: 'full' },
    departed: { label: 'Berangkat', tone: 'active' },
    completed: { label: 'Selesai', tone: 'active' },
    cancelled: { label: 'Dibatalkan', tone: 'full' },
    archived: { label: 'Diarsipkan', tone: 'draft' },
};

export default function PackagesIndex({
    packages: packagePage,
    filters,
}: {
    packages: PaginatedPackages;
    filters: { search?: string; status?: string };
}) {
    return (
        <>
            <Head title="Paket Umrah" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Paket umrah"
                    description="Kelola jadwal, kuota seat, periode registrasi, dan fasilitas setiap paket."
                    actions={
                        <Button
                            asChild
                            className="bg-emerald-700 text-white hover:bg-emerald-800"
                        >
                            <Link href={packages.create()}>
                                <Plus /> Tambah paket
                            </Link>
                        </Button>
                    }
                />
                <section className="overflow-hidden rounded-xl border bg-card">
                    <Form
                        {...packages.index.form()}
                        options={{ preserveState: true, replace: true }}
                        className="border-b bg-muted/15 p-4"
                    >
                        {({ processing }) => (
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                <div className="relative min-w-0 flex-1 lg:max-w-md">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        name="search"
                                        defaultValue={filters.search}
                                        className="bg-background pl-9"
                                        placeholder="Cari nama atau kode paket"
                                    />
                                </div>
                                <select
                                    name="status"
                                    defaultValue={filters.status ?? ''}
                                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                                >
                                    <option value="">Semua status</option>
                                    <option value="active">Aktif</option>
                                    <option value="draft">Draft</option>
                                    <option value="inactive">Nonaktif</option>
                                    <option value="full">Penuh</option>
                                    <option value="completed">Selesai</option>
                                </select>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    >
                                        <SlidersHorizontal /> Terapkan
                                    </Button>
                                    {(filters.search || filters.status) && (
                                        <Button asChild variant="ghost">
                                            <Link href={packages.index()}>
                                                <RotateCcw /> Reset
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Form>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="bg-muted/50 text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Kode
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Nama paket
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Keberangkatan
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Seat
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Okupansi
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-5 py-3">
                                        <span className="sr-only">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {packagePage.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                                            {item.code}
                                        </td>
                                        <td className="px-4 py-4 font-medium">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-4 text-muted-foreground">
                                            {item.departure_date}
                                        </td>
                                        <td className="px-4 py-4 tabular-nums">
                                            {item.used_seats} /{' '}
                                            {item.total_seats}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Progress
                                                label="Terisi"
                                                value={item.occupancy}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusBadge
                                                label={
                                                    packageStatuses[item.status]
                                                        ?.label ?? item.status
                                                }
                                                tone={
                                                    packageStatuses[item.status]
                                                        ?.tone ?? 'draft'
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`Aksi ${item.name}`}
                                                    >
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-52"
                                                >
                                                    <DropdownMenuLabel>
                                                        Aksi paket
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        asChild
                                                    >
                                                        <Link
                                                            href={packages.edit(
                                                                item.id,
                                                            )}
                                                            className="w-full"
                                                        >
                                                            <PencilLine /> Edit
                                                            paket
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {item.status ===
                                                    'active' ? (
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={deactivate(
                                                                    item.id,
                                                                )}
                                                                method="patch"
                                                                as="button"
                                                                className="w-full"
                                                                preserveScroll
                                                            >
                                                                <CircleOff />
                                                                Nonaktifkan
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={activate(
                                                                    item.id,
                                                                )}
                                                                method="patch"
                                                                as="button"
                                                                className="w-full"
                                                                preserveScroll
                                                            >
                                                                <PlayCircle />
                                                                Aktifkan
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {packagePage.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16">
                                            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                                                <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                    <PackageOpen className="size-5 text-muted-foreground" />
                                                </span>
                                                <p className="mt-4 font-medium">
                                                    Paket tidak ditemukan
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Coba ubah kata pencarian
                                                    atau reset filter yang
                                                    digunakan.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between border-t px-5 py-4 text-sm text-muted-foreground">
                        <span>
                            Menampilkan {packagePage.from ?? 0}-
                            {packagePage.to ?? 0} dari {packagePage.total} paket
                        </span>
                        <div className="flex gap-2">
                            <Button
                                asChild={Boolean(packagePage.prev_page_url)}
                                variant="outline"
                                size="sm"
                                disabled={!packagePage.prev_page_url}
                            >
                                {packagePage.prev_page_url ? (
                                    <Link href={packagePage.prev_page_url}>
                                        Sebelumnya
                                    </Link>
                                ) : (
                                    'Sebelumnya'
                                )}
                            </Button>
                            <Button
                                asChild={Boolean(packagePage.next_page_url)}
                                variant="outline"
                                size="sm"
                                disabled={!packagePage.next_page_url}
                            >
                                {packagePage.next_page_url ? (
                                    <Link href={packagePage.next_page_url}>
                                        Berikutnya
                                    </Link>
                                ) : (
                                    'Berikutnya'
                                )}
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
PackagesIndex.layout = {
    breadcrumbs: [{ title: 'Paket Umrah', href: packages.index() }],
};
