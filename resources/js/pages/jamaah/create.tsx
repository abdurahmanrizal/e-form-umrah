import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ContactRound,
    HeartPulse,
    MapPin,
    ShieldCheck,
} from 'lucide-react';
import { store } from '@/actions/App/Http/Controllers/JamaahController';
import InputError from '@/components/input-error';
import { PageHeading } from '@/components/operations/page-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as jamaah from '@/routes/jamaah';

type PackageOption = {
    id: number;
    name: string;
    departure_date: string;
    return_date: string;
    available_seats: number;
    facilities: string[];
};
const Field = ({
    label,
    name,
    error,
    children,
    helper,
}: {
    label: string;
    name: string;
    error?: string;
    children: React.ReactNode;
    helper?: string;
}) => (
    <div className="grid gap-2">
        <Label htmlFor={name}>{label}</Label>
        {children}
        {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
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

export default function JamaahCreate({
    packages,
}: {
    packages: PackageOption[];
}) {
    return (
        <>
            <Head title="Registrasi Jamaah" />
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Registrasi jamaah"
                    description="Isi identitas jamaah dan pilih paket aktif yang masih memiliki seat."
                    actions={
                        <Button asChild variant="outline">
                            <Link href={jamaah.index()}>
                                <ArrowLeft /> Kembali
                            </Link>
                        </Button>
                    }
                />
                <Form {...store.form()} className="grid gap-6">
                    {({ errors, processing }) => (
                        <>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={ContactRound}
                                    title="Identitas jamaah"
                                    description="Masukkan data sesuai KTP atau paspor untuk menghindari koreksi dokumen."
                                />
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Nama lengkap *"
                                        name="full_name"
                                        error={errors.full_name}
                                    >
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            autoComplete="name"
                                            placeholder="Nama lengkap sesuai identitas"
                                        />
                                    </Field>
                                    <Field
                                        label="Jenis kelamin *"
                                        name="gender"
                                        error={errors.gender}
                                    >
                                        <select
                                            id="gender"
                                            name="gender"
                                            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
                                        >
                                            <option value="">Pilih</option>
                                            <option value="male">
                                                Laki-laki
                                            </option>
                                            <option value="female">
                                                Perempuan
                                            </option>
                                        </select>
                                    </Field>
                                    <Field
                                        label="Tempat lahir *"
                                        name="birth_place"
                                        error={errors.birth_place}
                                    >
                                        <Input
                                            id="birth_place"
                                            name="birth_place"
                                            placeholder="Kota kelahiran"
                                        />
                                    </Field>
                                    <Field
                                        label="Tanggal lahir *"
                                        name="birth_date"
                                        error={errors.birth_date}
                                    >
                                        <Input
                                            id="birth_date"
                                            name="birth_date"
                                            type="date"
                                        />
                                    </Field>
                                    <Field
                                        label="NIK"
                                        name="nik"
                                        error={errors.nik}
                                    >
                                        <Input
                                            id="nik"
                                            name="nik"
                                            inputMode="numeric"
                                            maxLength={16}
                                            placeholder="16 digit NIK"
                                        />
                                    </Field>
                                    <Field
                                        label="Nomor passport"
                                        name="passport_number"
                                        error={errors.passport_number}
                                        helper="Minimal NIK atau nomor passport wajib diisi."
                                    >
                                        <Input
                                            id="passport_number"
                                            name="passport_number"
                                            placeholder="Contoh: C1234567"
                                        />
                                    </Field>
                                    <Field
                                        label="Nomor telepon *"
                                        name="phone"
                                        error={errors.phone}
                                    >
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </Field>
                                    <Field
                                        label="Email"
                                        name="email"
                                        error={errors.email}
                                    >
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="nama@email.com"
                                        />
                                    </Field>
                                </div>
                                <div className="mt-5">
                                    <Field
                                        label="Alamat *"
                                        name="address"
                                        error={errors.address}
                                    >
                                        <textarea
                                            id="address"
                                            name="address"
                                            placeholder="Alamat lengkap sesuai domisili"
                                            className="min-h-28 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                        />
                                    </Field>
                                </div>
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={MapPin}
                                    title="Pilih paket umrah"
                                    description="Hanya paket aktif dalam periode registrasi dan masih memiliki seat."
                                />
                                <div className="mt-6 grid gap-3">
                                    {packages.length === 0 ? (
                                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                            Belum ada paket aktif dengan seat
                                            tersedia.
                                        </div>
                                    ) : (
                                        packages.map((item, index) => (
                                            <label
                                                key={item.id}
                                                className="flex cursor-pointer items-start gap-4 rounded-xl border p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50/70 has-[:checked]:ring-3 has-[:checked]:ring-emerald-600/10 dark:has-[:checked]:bg-emerald-950/20"
                                            >
                                                <input
                                                    type="radio"
                                                    name="umrah_package_id"
                                                    value={item.id}
                                                    defaultChecked={index === 0}
                                                    className="mt-1 accent-emerald-700"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap justify-between gap-2">
                                                        <p className="font-medium">
                                                            {item.name}
                                                        </p>
                                                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                                            {
                                                                item.available_seats
                                                            }{' '}
                                                            seat tersisa
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {item.departure_date}{' '}
                                                        sampai{' '}
                                                        {item.return_date}
                                                    </p>
                                                    <p className="mt-3 text-xs text-muted-foreground">
                                                        {item.facilities.join(
                                                            ', ',
                                                        )}
                                                    </p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <InputError message={errors.umrah_package_id} />
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={ShieldCheck}
                                    title="Kontak darurat"
                                    description="Kontak keluarga yang dapat dihubungi selama persiapan dan perjalanan."
                                />
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Nama kontak *"
                                        name="emergency_contact_name"
                                        error={errors.emergency_contact_name}
                                    >
                                        <Input
                                            id="emergency_contact_name"
                                            name="emergency_contact_name"
                                            placeholder="Nama keluarga terdekat"
                                        />
                                    </Field>
                                    <Field
                                        label="Hubungan *"
                                        name="emergency_contact_relationship"
                                        error={
                                            errors.emergency_contact_relationship
                                        }
                                    >
                                        <Input
                                            id="emergency_contact_relationship"
                                            name="emergency_contact_relationship"
                                            placeholder="Contoh: Suami, Istri, Anak"
                                        />
                                    </Field>
                                    <Field
                                        label="Nomor telepon *"
                                        name="emergency_contact_phone"
                                        error={errors.emergency_contact_phone}
                                    >
                                        <Input
                                            id="emergency_contact_phone"
                                            name="emergency_contact_phone"
                                            type="tel"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </Field>
                                </div>
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <SectionHeading
                                    icon={HeartPulse}
                                    title="Informasi kesehatan"
                                    description="Catatan ini membantu tim operasional mempersiapkan pendampingan yang sesuai."
                                />
                                <div className="mt-6">
                                    <Field
                                        label="Catatan medis"
                                        name="medical_notes"
                                        error={errors.medical_notes}
                                        helper="Opsional. Cantumkan alergi, obat rutin, atau kebutuhan mobilitas."
                                    >
                                        <textarea
                                            id="medical_notes"
                                            name="medical_notes"
                                            rows={3}
                                            placeholder="Contoh: Alergi obat tertentu, membawa kursi roda..."
                                            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                        />
                                    </Field>
                                </div>
                            </section>
                            <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Data dapat dilengkapi kembali setelah jamaah
                                    terdaftar.
                                </p>
                                <Button
                                    disabled={
                                        processing || packages.length === 0
                                    }
                                    className="bg-emerald-700 text-white hover:bg-emerald-800"
                                    type="submit"
                                >
                                    <Check />{' '}
                                    {processing
                                        ? 'Mendaftarkan...'
                                        : 'Daftarkan jamaah'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </main>
        </>
    );
}
JamaahCreate.layout = {
    breadcrumbs: [
        { title: 'Jamaah', href: jamaah.index() },
        { title: 'Registrasi', href: jamaah.create() },
    ],
};
