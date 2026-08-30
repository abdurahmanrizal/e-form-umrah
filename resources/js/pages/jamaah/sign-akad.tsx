import { Form, Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    FileSignature,
    IdCard,
    Package,
    PenLine,
    Phone,
    RotateCcw,
    Save,
} from 'lucide-react';
import { useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { PageHeading } from '@/components/operations/page-heading';
import { Button } from '@/components/ui/button';
import * as jamaah from '@/routes/jamaah';

type Jamaah = {
    id: number;
    full_name: string;
    nik: string | null;
    passport_number: string | null;
    phone: string;
    registration_number: string | null;
    package_name: string | null;
    departure_date: string | null;
    has_signature: boolean;
};

export default function SignAkad({ jamaah: item }: { jamaah: Jamaah }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const [signature, setSignature] = useState('');
    const { props } = usePage();

    const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const bounds = canvas?.getBoundingClientRect();

        if (!canvas || !bounds) {
            return null;
        }

        return {
            x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
            y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
        };
    };

    const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const point = getPoint(event);
        const context = canvasRef.current?.getContext('2d');

        if (!point || !context) {
            return;
        }

        drawingRef.current = true;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.strokeStyle = '#294635';
        context.lineWidth = 3;
        context.lineCap = 'round';
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current) {
            return;
        }

        const point = getPoint(event);
        const context = canvasRef.current?.getContext('2d');

        if (!point || !context) {
            return;
        }

        context.lineTo(point.x, point.y);
        context.stroke();
    };

    const finishDrawing = () => {
        if (!drawingRef.current || !canvasRef.current) {
            return;
        }

        drawingRef.current = false;
        setSignature(canvasRef.current.toDataURL('image/png'));
    };

    const clearSignature = () => {
        canvasRef.current?.getContext('2d')?.clearRect(0, 0, 800, 240);
        setSignature('');
    };

    const flash = props.flash as { success?: string };

    return (
        <>
            <Head title="Penandatanganan Akad" />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Penandatanganan akad"
                    description="Bubuhkan tanda tangan jamaah untuk melengkapi dokumen akad."
                    actions={
                        <Button asChild variant="outline">
                            <Link href={jamaah.index()}>
                                <ArrowLeft /> Kembali
                            </Link>
                        </Button>
                    }
                />

                {flash?.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                        {flash.success}
                    </div>
                )}

                <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                <IdCard />
                            </span>
                            <div>
                                <p className="font-semibold">
                                    {item.full_name}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.nik ?? item.passport_number ?? '-'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                <Package />
                            </span>
                            <div>
                                <p className="font-semibold">
                                    {item.package_name ?? 'Belum ada paket'}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                    <CalendarDays className="size-3.5" />
                                    {item.departure_date ?? '-'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                <FileSignature />
                            </span>
                            <div>
                                <p className="font-mono text-sm">
                                    {item.registration_number ??
                                        'Belum terdaftar'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                <Phone />
                            </span>
                            <div>
                                <p className="font-semibold">{item.phone}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Kontak jamaah
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-semibold">
                                Tanda tangan jamaah
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Gunakan mouse, layar sentuh, atau stylus.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearSignature}
                        >
                            <RotateCcw /> Ulangi
                        </Button>
                    </div>

                    {item.has_signature && !signature && (
                        <p className="mt-3 flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="size-3.5" /> Jamaah sudah
                            menandatangani akad. Gambar ulang untuk
                            menggantinya.
                        </p>
                    )}

                    <Form {...jamaah.signature.form(item.id)} className="mt-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="overflow-hidden rounded-xl border border-dashed bg-white dark:bg-zinc-950">
                                    <canvas
                                        ref={canvasRef}
                                        width={800}
                                        height={240}
                                        className="h-48 w-full cursor-crosshair touch-none"
                                        onPointerDown={startDrawing}
                                        onPointerMove={draw}
                                        onPointerUp={finishDrawing}
                                        onPointerCancel={finishDrawing}
                                        aria-label="Area tanda tangan jamaah"
                                    />
                                </div>
                                <input
                                    type="hidden"
                                    name="signature"
                                    value={signature}
                                />
                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <PenLine className="size-3.5" /> Tanda
                                    tangan akan tercetak pada dokumen akad.
                                </div>
                                <InputError message={errors.signature} />
                                <Button
                                    disabled={processing || !signature}
                                    className="mt-5 bg-emerald-700 text-white hover:bg-emerald-800"
                                >
                                    <Save />
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan tanda tangan'}
                                </Button>
                            </>
                        )}
                    </Form>
                </section>
            </main>
        </>
    );
}

SignAkad.layout = {
    breadcrumbs: [{ title: 'Jamaah', href: jamaah.index() }],
};
