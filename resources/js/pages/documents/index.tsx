import { Form, Head, Link } from '@inertiajs/react';
import {
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    FileImage,
    FileText,
    Plus,
    Search,
    Upload,
    X,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PageHeading } from '@/components/operations/page-heading';
import { StatusBadge } from '@/components/operations/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as documents from '@/routes/documents';
import { store as uploadDocument } from '@/routes/jamaah/documents';

type DocumentItem = {
    id: number | null;
    type: string;
    required: boolean;
    status: string;
    original_name: string | null;
    expiry_date: string | null;
};
type JamaahGroup = {
    id: number;
    name: string;
    registration_number: string | null;
    package_name: string | null;
    departure_date: string | null;
    return_date: string | null;
    documents: DocumentItem[];
    required_total: number;
    required_verified: number;
};
type DocumentType = { id: number; name: string; is_required_default: boolean };
type Stats = { review: number; rejected: number; verified: number };

const statusLabels: Record<
    string,
    { label: string; tone: 'active' | 'confirmed' | 'draft' | 'full' }
> = {
    missing: { label: 'Belum diunggah', tone: 'draft' },
    uploaded: { label: 'Menunggu review', tone: 'draft' },
    under_review: { label: 'Perlu verifikasi', tone: 'confirmed' },
    verified: { label: 'Terverifikasi', tone: 'active' },
    rejected: { label: 'Perlu diperbaiki', tone: 'full' },
    expired: { label: 'Kedaluwarsa', tone: 'full' },
};

function formatSize(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function SearchableSelect({
    options,
    value,
    placeholder,
    onChange,
}: {
    options: { id: number; name: string }[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutside);

        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const selected = options.find((option) => String(option.id) === value);
    const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase()),
    );

    return (
        <div ref={containerRef} className="relative min-w-52">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            >
                <span
                    className={
                        selected ? 'truncate' : 'truncate text-muted-foreground'
                    }
                >
                    {selected?.name ?? placeholder}
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
            {open && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
                    <div className="relative border-b p-2">
                        <Search className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari paket..."
                            className="h-8 w-full rounded-md border bg-background pr-3 pl-8 text-sm outline-none focus:border-emerald-600"
                        />
                    </div>
                    <ul className="max-h-56 overflow-y-auto p-1">
                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setOpen(false);
                                    setQuery('');
                                }}
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                            >
                                {!value && (
                                    <Check className="size-4 text-emerald-700" />
                                )}
                                Semua paket
                            </button>
                        </li>
                        {filtered.map((option) => (
                            <li key={option.id}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(String(option.id));
                                        setOpen(false);
                                        setQuery('');
                                    }}
                                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                                >
                                    {value === String(option.id) && (
                                        <Check className="size-4 shrink-0 text-emerald-700" />
                                    )}
                                    <span className="truncate">
                                        {option.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="px-2 py-3 text-center text-sm text-muted-foreground">
                                Paket tidak ditemukan
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

function DocumentUploadForm({
    jamaahId,
    documentTypes,
}: {
    jamaahId: number;
    documentTypes: DocumentType[];
}) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(
        () => (previewUrl ? () => URL.revokeObjectURL(previewUrl) : undefined),
        [previewUrl],
    );

    const selectFile = (file: File | undefined) => {
        setSelectedFile(file ?? null);
        setPreviewUrl(
            file?.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        );
    };

    return (
        <Form
            {...uploadDocument.form(jamaahId)}
            resetOnSuccess
            onSuccess={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
            }}
            className="grid gap-3 rounded-xl border border-dashed bg-muted/20 p-4 sm:grid-cols-2"
        >
            {({ processing, errors }) => (
                <>
                    <select
                        name="document_type_id"
                        required
                        className="h-10 rounded-lg border bg-background px-3 text-sm sm:col-span-2"
                    >
                        <option value="">Pilih jenis dokumen</option>
                        {documentTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                                {type.is_required_default ? ' · wajib' : ''}
                            </option>
                        ))}
                    </select>
                    <input
                        name="file"
                        type="file"
                        required
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) =>
                            selectFile(event.target.files?.[0])
                        }
                        className="min-w-0 rounded-lg border bg-background px-3 py-2 text-xs"
                    />
                    <input
                        name="expiry_date"
                        type="date"
                        aria-label="Tanggal kedaluwarsa"
                        className="h-10 rounded-lg border bg-background px-3 text-sm"
                    />
                    {selectedFile && (
                        <div className="flex items-center gap-3 rounded-xl border bg-background p-3 sm:col-span-2">
                            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-emerald-700 dark:text-emerald-300">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview dokumen"
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <FileText className="size-7" />
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {selectedFile.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {selectedFile.type
                                        .split('/')
                                        .pop()
                                        ?.toUpperCase()}{' '}
                                    · {formatSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>
                    )}
                    {errors.file && (
                        <p className="text-xs text-destructive sm:col-span-2">
                            {errors.file}
                        </p>
                    )}
                    {errors.document_type_id && (
                        <p className="text-xs text-destructive sm:col-span-2">
                            {errors.document_type_id}
                        </p>
                    )}
                    {errors.expiry_date && (
                        <p className="text-xs text-destructive sm:col-span-2">
                            {errors.expiry_date}
                        </p>
                    )}
                    <Button
                        disabled={processing}
                        className="bg-emerald-700 text-white hover:bg-emerald-800 sm:col-span-2"
                    >
                        <Upload />
                        {processing ? 'Mengunggah...' : 'Upload dokumen'}
                    </Button>
                </>
            )}
        </Form>
    );
}

export default function DocumentsIndex({
    jamaah,
    stats,
    documentTypes,
    selectedJamaah,
    canReview,
    filters,
    packageOptions,
}: {
    jamaah: { data: JamaahGroup[]; total: number };
    stats: Stats;
    documentTypes: DocumentType[];
    selectedJamaah: { id: number; name: string } | null;
    canReview: boolean;
    filters: { search?: string; status?: string; package_id?: string };
    packageOptions: { id: number; name: string }[];
}) {
    const [openUploadId, setOpenUploadId] = useState<number | null>(null);
    const [packageId, setPackageId] = useState(filters.package_id ?? '');

    const toggleUpload = (id: number) =>
        setOpenUploadId((current) => (current === id ? null : id));

    return (
        <>
            <Head title="Monitoring Dokumen" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Kelengkapan dokumen jamaah"
                    description="Kelola dokumen berdasarkan jamaah dan jadwal keberangkatan. Verifikasi langsung dari setiap kelompok."
                />
                <section className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
                    <div className="flex items-center gap-4 bg-card p-5">
                        <Clock3 className="size-5 text-amber-600" />
                        <div>
                            <p className="text-2xl font-semibold tabular-nums">
                                {stats.review}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Menunggu verifikasi
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-card p-5">
                        <XCircle className="size-5 text-rose-600" />
                        <div>
                            <p className="text-2xl font-semibold tabular-nums">
                                {stats.rejected}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Perlu diperbaiki
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-card p-5">
                        <CheckCircle2 className="size-5 text-emerald-700" />
                        <div>
                            <p className="text-2xl font-semibold tabular-nums">
                                {stats.verified}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Terverifikasi
                            </p>
                        </div>
                    </div>
                </section>
                {selectedJamaah && (
                    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6 dark:border-emerald-900 dark:bg-emerald-950/20">
                        <p className="text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-300">
                            Lengkapi dokumen
                        </p>
                        <h2 className="mt-1 text-xl font-semibold">
                            {selectedJamaah.name}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Upload bertahap untuk melengkapi dokumen jamaah ini.
                        </p>
                        <div className="mt-4">
                            <DocumentUploadForm
                                jamaahId={selectedJamaah.id}
                                documentTypes={documentTypes}
                            />
                        </div>
                    </section>
                )}
                <Form
                    {...documents.index.form()}
                    options={{ preserveState: true, replace: true }}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <Input
                        name="search"
                        defaultValue={filters.search}
                        placeholder="Cari nama jamaah..."
                        className="sm:max-w-md"
                    />
                    <input type="hidden" name="package_id" value={packageId} />
                    <SearchableSelect
                        options={packageOptions}
                        value={packageId}
                        placeholder="Semua paket"
                        onChange={setPackageId}
                    />
                    <select
                        name="status"
                        defaultValue={filters.status ?? ''}
                        className="h-9 rounded-md border bg-background px-3 text-sm"
                    >
                        <option value="">Semua status</option>
                        <option value="review">Perlu verifikasi</option>
                        <option value="incomplete">Belum lengkap</option>
                    </select>
                    <Button type="submit" variant="outline">
                        <Search />
                        Terapkan
                    </Button>
                </Form>
                <section className="grid gap-4">
                    {jamaah.data.map((group) => (
                        <article
                            key={group.id}
                            className="overflow-hidden rounded-2xl border bg-card shadow-sm"
                        >
                            <header className="flex flex-col gap-4 border-b bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-semibold text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                        {group.name
                                            .split(' ')
                                            .map((word) => word[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold">
                                            {group.name}
                                        </h2>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {group.registration_number ??
                                                'Belum ada nomor registrasi'}{' '}
                                            ·{' '}
                                            {group.package_name ??
                                                'Paket belum dipilih'}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Keberangkatan{' '}
                                            {group.departure_date ?? '-'} sampai{' '}
                                            {group.return_date ?? '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="min-w-44">
                                        <div className="mb-2 flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Dokumen wajib
                                            </span>
                                            <strong>
                                                {group.required_verified}/
                                                {group.required_total}
                                            </strong>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-emerald-600 transition-all"
                                                style={{
                                                    width: `${group.required_total ? (group.required_verified / group.required_total) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {canReview && (
                                        <Button
                                            variant={
                                                openUploadId === group.id
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                toggleUpload(group.id)
                                            }
                                        >
                                            {openUploadId === group.id ? (
                                                <X />
                                            ) : (
                                                <Plus />
                                            )}
                                            {openUploadId === group.id
                                                ? 'Tutup'
                                                : 'Upload'}
                                        </Button>
                                    )}
                                </div>
                            </header>
                            {openUploadId === group.id && (
                                <div className="border-b p-4 sm:p-5">
                                    <DocumentUploadForm
                                        jamaahId={group.id}
                                        documentTypes={documentTypes}
                                    />
                                </div>
                            )}
                            <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                                {group.documents.map((document) => {
                                    const status =
                                        statusLabels[document.status] ??
                                        statusLabels.missing;

                                    return (
                                        <div
                                            key={document.type}
                                            className="flex items-center gap-3 rounded-xl border p-3"
                                        >
                                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                {document.status ===
                                                'missing' ? (
                                                    <Upload className="size-4 text-muted-foreground" />
                                                ) : document.original_name?.match(
                                                      /\.(jpg|jpeg|png)$/i,
                                                  ) ? (
                                                    <FileImage className="size-4 text-emerald-700" />
                                                ) : (
                                                    <FileText className="size-4 text-emerald-700" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {document.type}
                                                    {document.required ? (
                                                        <span className="text-rose-600">
                                                            {' '}
                                                            *
                                                        </span>
                                                    ) : null}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {document.original_name ??
                                                        'Belum diunggah'}
                                                </p>
                                            </div>
                                            {document.id &&
                                            canReview &&
                                            document.status ===
                                                'under_review' ? (
                                                <Link
                                                    href={documents.review(
                                                        document.id,
                                                    )}
                                                    method="patch"
                                                    data={{
                                                        status: 'verified',
                                                    }}
                                                    as="button"
                                                    preserveScroll
                                                    className="rounded-md bg-emerald-700 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-800"
                                                >
                                                    Verifikasi
                                                </Link>
                                            ) : (
                                                <StatusBadge
                                                    label={status.label}
                                                    tone={status.tone}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}
                    {jamaah.data.length === 0 && (
                        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-muted-foreground">
                            Belum ada data jamaah untuk ditampilkan.
                        </div>
                    )}
                </section>
                <p className="text-sm text-muted-foreground">
                    Menampilkan {jamaah.data.length} dari {jamaah.total} jamaah
                </p>
            </main>
        </>
    );
}
DocumentsIndex.layout = {
    breadcrumbs: [{ title: 'Dokumen', href: documents.index() }],
};
