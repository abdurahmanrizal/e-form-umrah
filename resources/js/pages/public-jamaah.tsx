import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ContactRound,
    ShieldCheck,
} from 'lucide-react';
import { publicStore } from '@/actions/App/Http/Controllers/JamaahController';
import { FlashToastListener } from '@/components/flash-toast-listener';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { home } from '@/routes';

type PackageOption = {
    id: number;
    name: string;
    departure_date: string;
    return_date: string;
    available_seats: number;
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

export default function PublicJamaah({
    packages,
}: {
    packages: PackageOption[];
}) {
    return (
        <>
            <Head title="Daftar Jamaah" />
            <FlashToastListener />
            <main className="min-h-svh bg-[#426b4d] dark:bg-[#203529]">
                <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-10">
                    <div className="flex w-full justify-center">
                        <Link href={home()} className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="The Sultan Umroh"
                                className="h-16 w-28 object-contain sm:h-20 sm:w-36"
                            />
                        </Link>
                    </div>
                </header>
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10 lg:py-12">
                    <section className="lg:sticky lg:top-8 lg:self-start lg:pt-12">
                        <p className="text-sm font-semibold tracking-wider text-[#d6ae28] uppercase">
                            Pendaftaran jamaah
                        </p>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                            Mulai perjalanan ibadah Anda.
                        </h1>
                        <p className="mt-6 max-w-md text-base leading-7 text-white/70">
                            Isi data dengan benar. Tim The Sultan Umroh akan
                            menghubungi Anda untuk konfirmasi berikutnya.
                        </p>
                        <div className="mt-10 grid gap-5">
                            <div className="flex gap-3">
                                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d6ae28]" />
                                <p className="text-sm text-white/70">
                                    Data aman dan diproses oleh tim resmi.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <CalendarDays className="mt-0.5 size-5 shrink-0 text-[#d6ae28]" />
                                <p className="text-sm text-white/70">
                                    Pilih jadwal keberangkatan yang tersedia.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#d6ae28]" />
                                <p className="text-sm text-white/70">
                                    Dokumen pendukung dilengkapi setelah
                                    pendaftaran.
                                </p>
                            </div>
                        </div>
                    </section>
                    <Form
                        {...publicStore.form()}
                        className="rounded-3xl border border-white/70 bg-white p-5 shadow-2xl shadow-[#17271e]/25 sm:p-8 lg:p-10 dark:bg-card"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="flex items-center gap-3 border-b pb-5">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#426b4d]/10 text-[#426b4d] dark:text-emerald-300">
                                        <ContactRound />
                                    </span>
                                    <div>
                                        <h2 className="font-semibold">
                                            Data pendaftaran
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Kolom bertanda * wajib diisi.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Nama lengkap *"
                                        name="full_name"
                                        error={errors.full_name}
                                    >
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            required
                                            placeholder="Sesuai KTP atau passport"
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
                                            required
                                            className="h-9 rounded-md border bg-background px-3 text-sm"
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
                                            required
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
                                            required
                                            type="date"
                                        />
                                    </Field>
                                    <Field
                                        label="NIK atau nomor passport *"
                                        name="nik"
                                        error={errors.nik}
                                    >
                                        <Input
                                            id="nik"
                                            name="nik"
                                            placeholder="Minimal salah satu diisi"
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
                                            required
                                            type="tel"
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
                                            placeholder="nama@email.com"
                                        />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field
                                            label="Alamat *"
                                            name="address"
                                            error={errors.address}
                                        >
                                            <textarea
                                                id="address"
                                                name="address"
                                                required
                                                rows={3}
                                                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-[#b38c0b] focus:ring-3 focus:ring-[#b38c0b]/10"
                                                placeholder="Alamat lengkap"
                                            />
                                        </Field>
                                    </div>
                                </div>
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="font-semibold">
                                        Pilih keberangkatan
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Pilih paket yang sesuai dengan rencana
                                        Anda.
                                    </p>
                                    <div className="mt-4 grid gap-3">
                                        {packages.length ? (
                                            packages.map((item, index) => (
                                                <label
                                                    key={item.id}
                                                    className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition hover:border-[#b38c0b] has-[:checked]:border-[#b38c0b] has-[:checked]:bg-[#b38c0b]/5"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="umrah_package_id"
                                                        value={item.id}
                                                        defaultChecked={
                                                            index === 0
                                                        }
                                                        required
                                                        className="mt-1 accent-[#b38c0b]"
                                                    />
                                                    <span className="min-w-0 flex-1">
                                                        <span className="flex flex-wrap justify-between gap-2 text-sm font-medium">
                                                            <span>
                                                                {item.name}
                                                            </span>
                                                            <span className="text-[#426b4d] dark:text-emerald-300">
                                                                {
                                                                    item.available_seats
                                                                }{' '}
                                                                seat tersedia
                                                            </span>
                                                        </span>
                                                        <span className="mt-1 block text-xs text-muted-foreground">
                                                            {
                                                                item.departure_date
                                                            }{' '}
                                                            sampai{' '}
                                                            {item.return_date}
                                                        </span>
                                                    </span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                                                Belum ada paket yang tersedia
                                                untuk pendaftaran.
                                            </p>
                                        )}
                                    </div>
                                    <InputError
                                        message={errors.umrah_package_id}
                                    />
                                </div>
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="font-semibold">
                                        Kontak darurat
                                    </h3>
                                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                                        <Field
                                            label="Nama kontak *"
                                            name="emergency_contact_name"
                                            error={
                                                errors.emergency_contact_name
                                            }
                                        >
                                            <Input
                                                name="emergency_contact_name"
                                                required
                                                placeholder="Nama keluarga"
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
                                                name="emergency_contact_relationship"
                                                required
                                                placeholder="Suami, istri, anak"
                                            />
                                        </Field>
                                        <Field
                                            label="Nomor kontak *"
                                            name="emergency_contact_phone"
                                            error={
                                                errors.emergency_contact_phone
                                            }
                                        >
                                            <Input
                                                name="emergency_contact_phone"
                                                required
                                                type="tel"
                                                placeholder="08xxxxxxxxxx"
                                            />
                                        </Field>
                                    </div>
                                </div>
                                <Button
                                    disabled={processing || !packages.length}
                                    type="submit"
                                    className="mt-8 h-11 w-full bg-[#426b4d] text-white hover:bg-[#294635]"
                                >
                                    {processing
                                        ? 'Mengirim pendaftaran...'
                                        : 'Kirim pendaftaran'}
                                    <ArrowRight />
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </main>
        </>
    );
}
