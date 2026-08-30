import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    PackageCheck,
    Users,
} from 'lucide-react';
import { Progress } from '@/components/operations/progress';
import { StatusBadge } from '@/components/operations/status-badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import * as jamaah from '@/routes/jamaah';
import * as packages from '@/routes/packages';

type Metrics = {
    total_jamaah: number;
    active_packages: number;
    total_seats: number;
    used_seats: number;
    available_seats: number;
    verified_jamaah: number;
};
type Departure = {
    name: string;
    date: string;
    seats: string;
    occupancy: number;
    status: string;
};
type Attention = {
    documents_review: number;
    missing_passport: number;
    almost_full_packages: number;
};

export default function Dashboard({
    metrics: values,
    departures,
    attention,
}: {
    metrics: Metrics;
    departures: Departure[];
    attention: Attention;
}) {
    const metrics = [
        {
            label: 'Total jamaah',
            value: values.total_jamaah,
            note: 'jamaah aktif',
            icon: Users,
        },
        {
            label: 'Paket aktif',
            value: values.active_packages,
            note: 'siap menerima registrasi',
            icon: PackageCheck,
        },
        {
            label: 'Seat tersedia',
            value: values.available_seats,
            note: `dari ${values.total_seats} seat`,
            icon: CalendarDays,
        },
        {
            label: 'Dokumen terverifikasi',
            value: values.verified_jamaah,
            note: 'jamaah memiliki dokumen valid',
            icon: CheckCircle2,
        },
    ];

    return (
        <>
            <Head title="Dashboard Operasional" />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
                <section className="relative overflow-hidden rounded-2xl bg-emerald-950 p-6 text-white shadow-lg shadow-emerald-950/10 sm:p-8">
                    <div className="relative z-[1] max-w-2xl">
                        <p className="text-sm font-medium text-emerald-300">
                            Ruang kendali operasional
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Selamat datang kembali.
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/75">
                            Pantau kesiapan jamaah, kapasitas paket, dan
                            keberangkatan terdekat dari satu tempat.
                        </p>
                        <Button
                            asChild
                            className="mt-6 bg-white text-emerald-950 hover:bg-emerald-50"
                        >
                            <Link href={jamaah.create()}>
                                Daftarkan jamaah <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                    <div className="absolute -right-16 -bottom-32 size-80 rounded-full border-[40px] border-emerald-800/40 sm:-right-4 sm:-bottom-40" />
                    <div className="absolute top-10 right-20 size-24 rounded-full border border-emerald-500/20" />
                </section>
                <section className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="bg-card p-5 transition hover:bg-muted/20 sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {metric.label}
                                    </p>
                                    <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
                                        {metric.value}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {metric.note}
                                    </p>
                                </div>
                                <metric.icon className="size-5 text-emerald-700 dark:text-emerald-400" />
                            </div>
                        </div>
                    ))}
                </section>
                <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                    <section className="rounded-2xl border bg-card p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="font-semibold">
                                    Tren registrasi
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    30 hari terakhir
                                </p>
                            </div>
                            <span className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                                Kapasitas saat ini
                            </span>
                        </div>
                        <div className="mt-10 grid gap-6 sm:grid-cols-[160px_1fr] sm:items-center">
                            <div className="relative mx-auto flex size-36 items-center justify-center rounded-full border-[14px] border-emerald-100 dark:border-emerald-950/50">
                                <div className="absolute inset-[-14px] rounded-full border-[14px] border-transparent border-t-emerald-600 border-r-emerald-600" />
                                <div className="text-center">
                                    <p className="text-3xl font-semibold tabular-nums">
                                        {values.used_seats}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        seat terisi
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Terisi
                                        </span>
                                        <span className="font-medium">
                                            {values.used_seats} seat
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            values.total_seats
                                                ? Math.round(
                                                      (values.used_seats /
                                                          values.total_seats) *
                                                          100,
                                                  )
                                                : 0
                                        }
                                        label=""
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-muted/40 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Total kapasitas
                                        </p>
                                        <p className="mt-2 text-xl font-semibold">
                                            {values.total_seats}
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                                        <p className="text-xs text-muted-foreground">
                                            Tersedia
                                        </p>
                                        <p className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-300">
                                            {values.available_seats}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="rounded-2xl border bg-card p-5 sm:p-6">
                        <h2 className="font-semibold">Perlu ditindaklanjuti</h2>
                        <p className="text-sm text-muted-foreground">
                            Prioritas operasional hari ini
                        </p>
                        <div className="mt-5 divide-y">
                            {[
                                [
                                    attention.missing_passport,
                                    'Passport belum tersedia',
                                    'Lengkapi data identitas',
                                ],
                                [
                                    attention.documents_review,
                                    'Dokumen perlu verifikasi',
                                    'Tinjau hari ini',
                                ],
                                [
                                    attention.almost_full_packages,
                                    'Paket hampir penuh',
                                    'Okupansi di atas 80%',
                                ],
                            ].map(([count, label, note]) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                        {count}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {note}
                                        </p>
                                    </div>
                                    <CircleAlert className="size-4 text-amber-600" />
                                </div>
                            ))}
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="mt-6 w-full"
                        >
                            <Link href={jamaah.index()}>
                                Lihat semua jamaah <ArrowRight />
                            </Link>
                        </Button>
                    </section>
                </div>
                <section className="overflow-hidden rounded-2xl border bg-card">
                    <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="font-semibold">
                                Keberangkatan terdekat
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Diurutkan berdasarkan tanggal keberangkatan
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={packages.index()}>
                                Semua paket <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-muted/50 text-xs text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3 font-medium">
                                        Paket
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
                                        Dokumen
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {departures.map((item) => (
                                    <tr
                                        key={item.name}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-4 text-muted-foreground">
                                            {item.date}
                                        </td>
                                        <td className="px-4 py-4 tabular-nums">
                                            {item.seats}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Progress
                                                value={item.occupancy}
                                                label="Terisi"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <Progress
                                                value={0}
                                                label="Lengkap"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                label="Aktif"
                                                tone="active"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = { breadcrumbs: [{ title: 'Dashboard', href: dashboard() }] };
