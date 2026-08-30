export function Progress({ value, label }: { value: number; label: string }) {
    return (
        <div className="min-w-28 space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium tabular-nums">{value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-emerald-600 transition-[width]"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
