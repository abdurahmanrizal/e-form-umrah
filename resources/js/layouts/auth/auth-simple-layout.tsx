import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#f7f8f5] p-4 md:p-10 dark:bg-background">
            <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl shadow-[#294635]/5 sm:p-8">
                <div className="flex flex-col gap-7">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-4 font-medium"
                        >
                            <div className="flex aspect-[3978/2326] w-56 items-center justify-center overflow-hidden transition group-hover:scale-[1.02]">
                                <img
                                    src="/logo.png"
                                    alt="The Sultan Umroh"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
