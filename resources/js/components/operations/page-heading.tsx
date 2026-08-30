import type { ReactNode } from 'react';

export function PageHeading({
    title,
    description,
    actions,
}: {
    title: string;
    description: string;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
            {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
    );
}
