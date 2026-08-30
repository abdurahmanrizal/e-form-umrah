import { Form, Head } from '@inertiajs/react';
import {
    Building2,
    Check,
    FileSignature,
    Landmark,
    PenLine,
    RotateCcw,
    Save,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { update } from '@/actions/App/Http/Controllers/GeneralSettingController';
import InputError from '@/components/input-error';
import { PageHeading } from '@/components/operations/page-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as settings from '@/routes/admin/general-settings';

type Settings = {
    company_name: string;
    company_address: string | null;
    company_email: string | null;
    company_phone: string | null;
    manager_name: string;
    manager_title: string;
    default_dp: string | null;
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

export default function GeneralSettings({
    settings: values,
    hasManagerSignature,
}: {
    settings: Settings;
    hasManagerSignature: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef(false);
    const [signature, setSignature] = useState('');
    const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const bounds = canvas?.getBoundingClientRect();

        return canvas && bounds
            ? {
                  x:
                      ((event.clientX - bounds.left) / bounds.width) *
                      canvas.width,
                  y:
                      ((event.clientY - bounds.top) / bounds.height) *
                      canvas.height,
              }
            : null;
    };
    const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const position = getPoint(event);
        const context = canvasRef.current?.getContext('2d');

        if (!position || !context) {
            return;
        }

        drawingRef.current = true;
        context.beginPath();
        context.moveTo(position.x, position.y);
        context.strokeStyle = '#294635';
        context.lineWidth = 3;
        context.lineCap = 'round';
        event.currentTarget.setPointerCapture(event.pointerId);
    };
    const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (!drawingRef.current) {
            return;
        }

        const position = getPoint(event);
        const context = canvasRef.current?.getContext('2d');

        if (!position || !context) {
            return;
        }

        context.lineTo(position.x, position.y);
        context.stroke();
    };
    const finishDrawing = () => {
        if (!drawingRef.current || !canvasRef.current) {
            return;
        }

        drawingRef.current = false;
        setSignature(canvasRef.current.toDataURL('image/png'));
    };
    const clear = () => {
        canvasRef.current?.getContext('2d')?.clearRect(0, 0, 800, 240);
        setSignature('');
    };

    return (
        <>
            <Head title="Pengaturan Umum" />
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <PageHeading
                    title="Pengaturan umum"
                    description="Kelola identitas perusahaan dan tanda tangan yang digunakan pada dokumen akad."
                />
                <Form {...update.form()} className="grid gap-6">
                    {({ errors, processing }) => (
                        <>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <div className="flex items-start gap-3 border-b pb-5">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <Building2 />
                                    </span>
                                    <div>
                                        <h2 className="font-semibold">
                                            Identitas perusahaan
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Informasi ini tampil pada header PDF
                                            akad.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Nama perusahaan *"
                                        name="company_name"
                                        error={errors.company_name}
                                    >
                                        <Input
                                            id="company_name"
                                            name="company_name"
                                            defaultValue={values.company_name}
                                        />
                                    </Field>
                                    <Field
                                        label="Email perusahaan"
                                        name="company_email"
                                        error={errors.company_email}
                                    >
                                        <Input
                                            id="company_email"
                                            name="company_email"
                                            type="email"
                                            defaultValue={
                                                values.company_email ?? ''
                                            }
                                        />
                                    </Field>
                                    <Field
                                        label="Nomor telepon"
                                        name="company_phone"
                                        error={errors.company_phone}
                                    >
                                        <Input
                                            id="company_phone"
                                            name="company_phone"
                                            defaultValue={
                                                values.company_phone ?? ''
                                            }
                                        />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field
                                            label="Alamat perusahaan"
                                            name="company_address"
                                            error={errors.company_address}
                                        >
                                            <textarea
                                                id="company_address"
                                                name="company_address"
                                                rows={3}
                                                defaultValue={
                                                    values.company_address ?? ''
                                                }
                                                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <div className="flex items-start gap-3 border-b pb-5">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                        <FileSignature />
                                    </span>
                                    <div>
                                        <h2 className="font-semibold">
                                            Penandatangan akad
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Nama, jabatan, dan tanda tangan
                                            manager pada PDF.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <Field
                                        label="Nama manager *"
                                        name="manager_name"
                                        error={errors.manager_name}
                                    >
                                        <Input
                                            id="manager_name"
                                            name="manager_name"
                                            defaultValue={values.manager_name}
                                        />
                                    </Field>
                                    <Field
                                        label="Jabatan *"
                                        name="manager_title"
                                        error={errors.manager_title}
                                    >
                                        <Input
                                            id="manager_title"
                                            name="manager_title"
                                            defaultValue={values.manager_title}
                                        />
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <Label htmlFor="manager_signature">
                                                    Tanda tangan manager
                                                </Label>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Gunakan mouse, layar sentuh,
                                                    atau stylus.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={clear}
                                            >
                                                <RotateCcw /> Ulangi
                                            </Button>
                                        </div>
                                        <div className="mt-3 overflow-hidden rounded-xl border border-dashed bg-white dark:bg-zinc-950">
                                            <canvas
                                                ref={canvasRef}
                                                width={800}
                                                height={240}
                                                className="h-40 w-full cursor-crosshair touch-none sm:h-48"
                                                onPointerDown={startDrawing}
                                                onPointerMove={draw}
                                                onPointerUp={finishDrawing}
                                                onPointerCancel={finishDrawing}
                                                aria-label="Area tanda tangan manager"
                                            />
                                        </div>
                                        <input
                                            type="hidden"
                                            name="manager_signature"
                                            value={signature}
                                        />
                                        {hasManagerSignature && !signature && (
                                            <p className="mt-2 flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-300">
                                                <Check className="size-3.5" />{' '}
                                                Tanda tangan manager tersimpan.
                                                Gambar ulang untuk menggantinya.
                                            </p>
                                        )}
                                        {errors.manager_signature && (
                                            <p className="mt-2 text-xs text-destructive">
                                                {errors.manager_signature}
                                            </p>
                                        )}
                                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                            <PenLine className="size-3.5" />{' '}
                                            Tanda tangan akan tampil pada PDF
                                            akad.
                                        </p>
                                    </div>
                                </div>
                            </section>
                            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
                                <div className="flex items-start gap-3 border-b pb-5">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                                        <Landmark />
                                    </span>
                                    <div>
                                        <h2 className="font-semibold">
                                            Ketentuan pembayaran
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Nilai DP default untuk referensi
                                            operasional.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 max-w-sm">
                                    <Field
                                        label="DP default"
                                        name="default_dp"
                                        error={errors.default_dp}
                                    >
                                        <Input
                                            id="default_dp"
                                            name="default_dp"
                                            type="number"
                                            min="0"
                                            step="1000"
                                            defaultValue={
                                                values.default_dp ?? ''
                                            }
                                            placeholder="5000000"
                                        />
                                    </Field>
                                </div>
                            </section>
                            <div className="flex justify-end">
                                <Button
                                    disabled={processing}
                                    className="bg-emerald-700 text-white hover:bg-emerald-800"
                                >
                                    <Save />
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan pengaturan'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </main>
        </>
    );
}
GeneralSettings.layout = {
    breadcrumbs: [{ title: 'Pengaturan Umum', href: settings.edit() }],
};
