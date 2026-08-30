import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ContactRound,
    HeartPulse,
    ShieldCheck,
} from 'lucide-react';
import { update } from '@/actions/App/Http/Controllers/JamaahController';
import InputError from '@/components/input-error';
import { PageHeading } from '@/components/operations/page-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as jamaah from '@/routes/jamaah';

type JamaahForm = {
    id: number;
    full_name: string;
    gender: string;
    birth_place: string;
    birth_date: string;
    nik: string | null;
    passport_number: string | null;
    passport_issue_date: string | null;
    passport_expiry_date: string | null;
    passport_issuing_office: string | null;
    phone: string;
    email: string | null;
    address: string;
    emergency_contact_name: string;
    emergency_contact_relationship: string;
    emergency_contact_phone: string;
    emergency_contact_address: string | null;
    blood_type: string | null;
    medical_notes: string | null;
    special_assistance: string | null;
    wheelchair_required: boolean;
    dietary_notes: string | null;
    internal_notes: string | null;
    jamaah_notes: string | null;
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

export default function JamaahEdit({ jamaah: values }: { jamaah: JamaahForm }) {
    return (
        <>
            <Head title={`Edit Jamaah · ${values.full_name}`} />
            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title={`Edit jamaah · ${values.full_name}`}
                    description="Perbarui identitas dan data pendukung jamaah sesuai dokumen terbaru."
                    actions={
                        <Button asChild variant="outline">
                            <Link href={jamaah.index()}>
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
                                    icon={ContactRound}
                                    title="Identitas jamaah"
                                    description="Pastikan data sesuai KTP atau paspor terbaru."
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
                                            defaultValue={values.full_name}
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
                                            defaultValue={values.gender}
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
                                            defaultValue={values.birth_place}
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
                                            defaultValue={values.birth_date}
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
                                            defaultValue={values.nik ?? ''}
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
                                            defaultValue={
                                                values.passport_number ?? ''
                                            }
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
                                            defaultValue={values.phone}
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
                                            defaultValue={values.email ?? ''}
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
                                            defaultValue={values.address}
                                            className="min-h-28 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                        />
                                    </Field>
                                </div>
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
                                            defaultValue={
                                                values.emergency_contact_name
                                            }
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
                                            defaultValue={
                                                values.emergency_contact_relationship
                                            }
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
                                            defaultValue={
                                                values.emergency_contact_phone
                                            }
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
                                            defaultValue={
                                                values.medical_notes ?? ''
                                            }
                                            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm transition outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                        />
                                    </Field>
                                </div>
                            </section>
                            <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Paket dan status registrasi diatur melalui
                                    halaman jamaah.
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
JamaahEdit.layout = {
    breadcrumbs: [
        { title: 'Jamaah', href: jamaah.index() },
        { title: 'Edit Jamaah' },
    ],
};