import { Form, Head, Link } from '@inertiajs/react';
import {
    Ban,
    Eye,
    FileText,
    FileSignature,
    MoreHorizontal,
    PencilLine,
    SearchX,
    Plus,
    RotateCcw,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import { cancel } from '@/actions/App/Http/Controllers/RegistrationController';
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
import * as documents from '@/routes/documents';
import * as jamaah from '@/routes/jamaah';

type JamaahRow = {
    id: number;
    full_name: string;
    nik: string | null;
    passport_number: string | null;
    phone: string;
    registration_number: string | null;
    registration_status: string | null;
    package_name: string | null;
    document_completion: number;
    required_verified: number;
    required_total: number;
};
type PaginatedJamaah = {
    data: JamaahRow[];
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};
const registrationStatuses: Record<
    string,
    { label: string; tone: 'active' | 'confirmed' | 'draft' | 'full' }
> = {
    draft: { label: 'Draft', tone: 'draft' },
    registered: { label: 'Terdaftar', tone: 'active' },
    confirmed: { label: 'Terkonfirmasi', tone: 'confirmed' },
    cancelled: { label: 'Dibatalkan', tone: 'full' },
    departed: { label: 'Berangkat', tone: 'active' },
    completed: { label: 'Selesai', tone: 'active' },
};

export default function JamaahIndex({
    jamaah: jamaahPage,
    filters,
    packageOptions,
}: {
    jamaah: PaginatedJamaah;
    filters: {
        search?: string;
        package_id?: string;
        registration_status?: string;
        document_state?: string;
    };
    packageOptions: { id: number; name: string }[];
}) {
    return (
        <>
            <Head title="Data Jamaah" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Data jamaah"
                    description="Kelola registrasi, paket keberangkatan, dan kesiapan dokumen setiap jamaah."
                    actions={
                        <Button
                            asChild
                            className="bg-emerald-700 text-white hover:bg-emerald-800"
                        >
                            <Link href={jamaah.create()}>
                                <Plus /> Registrasi jamaah
                            </Link>
                        </Button>
                    }
                />
                <section className="overflow-hidden rounded-xl border bg-card">
                    <Form
                        {...jamaah.index.form()}
                        options={{ preserveState: true, replace: true }}
                        className="border-b bg-muted/15 p-4"
                    >
                        {({ processing }) => (
                            <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_auto_auto_auto_auto]">
                                <div className="relative min-w-0">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        name="search"
                                        defaultValue={filters.search}
                                        className="bg-background pl-9"
                                        placeholder="Cari nama, registrasi, NIK, passport..."
                                    />
                                </div>
                                <select
                                    name="package_id"
                                    defaultValue={filters.package_id ?? ''}
                                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600"
                                >
                                    <option value="">Semua paket</option>
                                    {packageOptions.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="registration_status"
                                    defaultValue={
                                        filters.registration_status ?? ''
                                    }
                                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600"
                                >
                                    <option value="">Semua registrasi</option>
                                    <option value="registered">
                                        Terdaftar
                                    </option>
                                    <option value="confirmed">
                                        Terkonfirmasi
                                    </option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                    <option value="departed">Berangkat</option>
                                    <option value="completed">Selesai</option>
                                </select>
                                <select
                                    name="document_state"
                                    defaultValue={filters.document_state ?? ''}
                                    className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600"
                                >
                                    <option value="">Semua dokumen</option>
                                    <option value="verified">
                                        Terverifikasi
                                    </option>
                                    <option value="incomplete">
                                        Belum lengkap
                                    </option>
                                </select>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    >
                                        <SlidersHorizontal /> Terapkan
                                    </Button>
                                    {Object.values(filters).some(Boolean) && (
                                        <Button asChild variant="ghost">
                                            <Link href={jamaah.index()}>
                                                <RotateCcw /> Reset
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Form>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] text-left text-sm">
                            <thead className="bg-muted/50 text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Jamaah
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        NIK / Passport
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Paket
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Telepon
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Dokumen
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Registrasi
                                    </th>
                                    <th className="px-5 py-3">
                                        <span className="sr-only">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {jamaahPage.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {item.full_name}
                                            </p>
                                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                                                {item.registration_number ??
                                                    'Belum terdaftar'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                                            {item.nik ??
                                                item.passport_number ??
                                                '-'}
                                        </td>
                                        <td className="px-4 py-4">
                                            {item.package_name ?? '-'}
                                        </td>
                                        <td className="px-4 py-4 text-muted-foreground">
                                            {item.phone}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Progress
                                                value={item.document_completion}
                                                label={`${item.required_verified}/${item.required_total} wajib`}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusBadge
                                                label={
                                                    registrationStatuses[
                                                        item.registration_status ??
                                                            ''
                                                    ]?.label ??
                                                    'Belum terdaftar'
                                                }
                                                tone={
                                                    registrationStatuses[
                                                        item.registration_status ??
                                                            ''
                                                    ]?.tone ?? 'draft'
                                                }
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <Link
                                                        href={documents.index({
                                                            query: {
                                                                search: item.full_name,
                                                            },
                                                        })}
                                                        aria-label={`Dokumen ${item.full_name}`}
                                                    >
                                                        <FileText />
                                                    </Link>
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label={`Aksi ${item.full_name}`}
                                                        >
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-56"
                                                    >
                                                        <DropdownMenuLabel>
                                                            Aksi jamaah
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={jamaah.edit(
                                                                    item.id,
                                                                )}
                                                                className="w-full"
                                                            >
                                                                <PencilLine />{' '}
                                                                Edit jamaah
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={documents.index(
                                                                    {
                                                                        query: {
                                                                            search: item.full_name,
                                                                        },
                                                                    },
                                                                )}
                                                            >
                                                                <Eye /> Lihat
                                                                dokumen
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={jamaah.signAkad(
                                                                    item.id,
                                                                )}
                                                            >
                                                                <FileSignature />{' '}
                                                                Tandatangani
                                                                akad
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <a
                                                                href={
                                                                    jamaah.akad(
                                                                        item.id,
                                                                    ).url
                                                                }
                                                                download
                                                            >
                                                                <FileSignature />{' '}
                                                                Export Akad PDF
                                                            </a>
                                                        </DropdownMenuItem>
                                                        {item.registration_status !==
                                                            'cancelled' && (
                                                            <DropdownMenuItem
                                                                asChild
                                                                variant="destructive"
                                                            >
                                                                <Link
                                                                    href={cancel(
                                                                        item.id,
                                                                    )}
                                                                    method="patch"
                                                                    data={{
                                                                        reason: 'Dibatalkan dari daftar jamaah',
                                                                    }}
                                                                    as="button"
                                                                    className="w-full"
                                                                    preserveScroll
                                                                    onBefore={() =>
                                                                        window.confirm(
                                                                            `Batalkan registrasi ${item.full_name}?`,
                                                                        )
                                                                    }
                                                                >
                                                                    <Ban />{' '}
                                                                    Batalkan
                                                                    registrasi
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {jamaahPage.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16">
                                            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                                                <span className="flex size-12 items-center justify-center rounded-full bg-muted">
                                                    <SearchX className="size-5 text-muted-foreground" />
                                                </span>
                                                <p className="mt-4 font-medium">
                                                    Jamaah tidak ditemukan
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Ubah pencarian atau reset
                                                    filter untuk melihat data
                                                    lain.
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
                            Menampilkan {jamaahPage.from ?? 0}-
                            {jamaahPage.to ?? 0} dari {jamaahPage.total} jamaah
                        </span>
                        <div className="flex gap-2">
                            <Button
                                asChild={Boolean(jamaahPage.prev_page_url)}
                                variant="outline"
                                size="sm"
                                disabled={!jamaahPage.prev_page_url}
                            >
                                {jamaahPage.prev_page_url ? (
                                    <Link href={jamaahPage.prev_page_url}>
                                        Sebelumnya
                                    </Link>
                                ) : (
                                    'Sebelumnya'
                                )}
                            </Button>
                            <Button
                                asChild={Boolean(jamaahPage.next_page_url)}
                                variant="outline"
                                size="sm"
                                disabled={!jamaahPage.next_page_url}
                            >
                                {jamaahPage.next_page_url ? (
                                    <Link href={jamaahPage.next_page_url}>
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
JamaahIndex.layout = {
    breadcrumbs: [{ title: 'Jamaah', href: jamaah.index() }],
};
