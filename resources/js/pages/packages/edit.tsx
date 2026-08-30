import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Check,
    CircleCheck,
    FilePenLine,
    Plane,
    Sparkles,
} from 'lucide-react';
import { update } from '@/actions/App/Http/Controllers/UmrahPackageController';
import InputError from '@/components/input-error';
import { PageHeading } from '@/components/operations/page-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as packages from '@/routes/packages';

type Facility = { id: number; name: string };
type PackageForm = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    departure_date: string;
    return_date: string;
    total_seats: number;
    price: string | null;
    registration_open_date: string | null;
    registration_close_date: string | null;
    meeting_point: string | null;
    airline: string | null;
    hotel_makkah: string | null;
    hotel_madinah: string | null;
    room_type: string | null;
    notes: string | null;
    status: string;
    facility_ids: number[];
};
const Field = ({
    label,
    name,
    error,
    children,
}: {
    label: string;
    name: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="grid gap-2">
        <Label htmlFor={name}>{label}</Label>
        {children}
        <InputError message={error} />
    </div>
);

const SectionHeading = ({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
}) => (
    <div className="flex items-start gap-3 border-b pb-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Icon className="size-5" />
        </span>
        <div>
            <h2 className="font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default function PackageEdit({
    package: values,
    facilities,
}: {
    package: PackageForm;
    facilities: Facility[];
}) {
    return (
        <>
            <Head title={`Edit Paket · ${values.name}`} />
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title={`Edit paket · ${values.name}`}
                    description="Perbarui jadwal, kuota, fasilitas, dan status publikasi paket."
                    actions={
                        <Button asChild variant="outline">
                            <Link href={packages.index()}>
                                <ArrowLeft /> Kembali
                            </Link>
                        </Button>
                    }
                />
                <Form {...update.form(values.id)} className="grid gap-6">
                    {({ errors, processing }) => (
                        <>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={FilePenLine}
                                    title="Informasi paket"
                                    description="Identitas utama yang akan tampil pada daftar paket."
                                />
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Nama paket *"
                                        name="name"
                                        error={errors.name}
                                    >
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={values.name}
                                            placeholder="Syawal Plus Thaif"
                                        />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field
                                            label="Deskripsi singkat"
                                            name="description"
                                            error={errors.description}
                                        >
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={3}
                                                defaultValue={
                                                    values.description ?? ''
                                                }
                                                placeholder="Jelaskan keunggulan dan gambaran perjalanan paket ini."
                                                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={CalendarDays}
                                    title="Jadwal & ketersediaan"
                                    description="Atur perjalanan, periode pendaftaran, kuota, dan harga."
                                />
                                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <Field
                                        label="Kode paket *"
                                        name="code"
                                        error={errors.code}
                                    >
                                        <Input
                                            id="code"
                                            name="code"
                                            defaultValue={values.code}
                                            placeholder="UMR-2604-SYT"
                                        />
                                    </Field>
                                    <Field
                                        label="Tanggal keberangkatan *"
                                        name="departure_date"
                                        error={errors.departure_date}
                                    >
                                        <Input
                                            id="departure_date"
                                            name="departure_date"
                                            type="date"
                                            defaultValue={values.departure_date}
                                        />
                                    </Field>
                                    <Field
                                        label="Tanggal kepulangan *"
                                        name="return_date"
                                        error={errors.return_date}
                                    >
                                        <Input
                                            id="return_date"
                                            name="return_date"
                                            type="date"
                                            defaultValue={values.return_date}
                                        />
                                    </Field>
                                    <Field
                                        label="Total seat *"
                                        name="total_seats"
                                        error={errors.total_seats}
                                    >
                                        <Input
                                            id="total_seats"
                                            name="total_seats"
                                            type="number"
                                            min="1"
                                            defaultValue={values.total_seats}
                                        />
                                    </Field>
                                    <Field
                                        label="Harga per jamaah"
                                        name="price"
                                        error={errors.price}
                                    >
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            defaultValue={values.price ?? ''}
                                        />
                                    </Field>
                                    <Field
                                        label="Registrasi dibuka"
                                        name="registration_open_date"
                                        error={errors.registration_open_date}
                                    >
                                        <Input
                                            id="registration_open_date"
                                            name="registration_open_date"
                                            type="date"
                                            defaultValue={
                                                values.registration_open_date ??
                                                ''
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Registrasi ditutup"
                                        name="registration_close_date"
                                        error={errors.registration_close_date}
                                    >
                                        <Input
                                            id="registration_close_date"
                                            name="registration_close_date"
                                            type="date"
                                            defaultValue={
                                                values.registration_close_date ??
                                                ''
                                            }
                                        />
                                    </Field>
                                </div>
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={Sparkles}
                                    title="Fasilitas paket"
                                    description="Pilih layanan yang termasuk dalam paket ini."
                                />
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {facilities.map((facility) => (
                                        <label
                                            key={facility.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition hover:border-emerald-300 hover:bg-emerald-50/40 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50/70 dark:has-[:checked]:bg-emerald-950/20"
                                        >
                                            <input
                                                type="checkbox"
                                                name="facility_ids[]"
                                                value={facility.id}
                                                defaultChecked={values.facility_ids.includes(
                                                    facility.id,
                                                )}
                                                className="size-4 accent-emerald-700"
                                            />
                                            <span>{facility.name}</span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.facility_ids} />
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={Plane}
                                    title="Detail perjalanan"
                                    description="Informasi operasional penerbangan dan akomodasi."
                                />
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Maskapai"
                                        name="airline"
                                        error={errors.airline}
                                    >
                                        <Input
                                            id="airline"
                                            name="airline"
                                            defaultValue={values.airline ?? ''}
                                        />
                                    </Field>
                                    <Field
                                        label="Titik kumpul"
                                        name="meeting_point"
                                        error={errors.meeting_point}
                                    >
                                        <Input
                                            id="meeting_point"
                                            name="meeting_point"
                                            defaultValue={
                                                values.meeting_point ?? ''
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Hotel Makkah"
                                        name="hotel_makkah"
                                        error={errors.hotel_makkah}
                                    >
                                        <Input
                                            id="hotel_makkah"
                                            name="hotel_makkah"
                                            defaultValue={
                                                values.hotel_makkah ?? ''
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Hotel Madinah"
                                        name="hotel_madinah"
                                        error={errors.hotel_madinah}
                                    >
                                        <Input
                                            id="hotel_madinah"
                                            name="hotel_madinah"
                                            defaultValue={
                                                values.hotel_madinah ?? ''
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Tipe kamar"
                                        name="room_type"
                                        error={errors.room_type}
                                    >
                                        <Input
                                            id="room_type"
                                            name="room_type"
                                            defaultValue={values.room_type ?? ''}
                                            placeholder="Quad / Triple / Double"
                                        />
                                    </Field>
                                </div>
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={CircleCheck}
                                    title="Status publikasi"
                                    description="Draft dapat dilengkapi nanti. Aktif langsung tersedia untuk registrasi jamaah."
                                />
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <label className="flex cursor-pointer gap-3 rounded-xl border p-4 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/70 dark:has-[:checked]:bg-amber-950/20">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="draft"
                                            defaultChecked={
                                                values.status === 'draft'
                                            }
                                            className="mt-1 accent-amber-600"
                                        />
                                        <span>
                                            <span className="block font-medium">
                                                Simpan sebagai draft
                                            </span>
                                            <span className="mt-1 block text-sm text-muted-foreground">
                                                Belum dapat dipilih saat
                                                registrasi jamaah.
                                            </span>
                                        </span>
                                    </label>
                                    <label className="flex cursor-pointer gap-3 rounded-xl border p-4 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50/70 dark:has-[:checked]:bg-emerald-950/20">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="active"
                                            defaultChecked={
                                                values.status === 'active'
                                            }
                                            className="mt-1 accent-emerald-700"
                                        />
                                        <span>
                                            <span className="block font-medium">
                                                Aktifkan sekarang
                                            </span>
                                            <span className="mt-1 block text-sm text-muted-foreground">
                                                Paket langsung muncul di form
                                                registrasi.
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <InputError message={errors.status} />
                            </section>
                            <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Kolom bertanda * wajib diisi.
                                </p>
                                <Button
                                    disabled={processing}
                                    className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    type="submit"
                                >
                                    <Check />{' '}
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan perubahan'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </main>
        </>
    );
}
PackageEdit.layout = {
    breadcrumbs: [
        { title: 'Paket Umrah', href: packages.index() },
        { title: 'Edit Paket' },
    ],
};