import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function FlashToastListener() {
    const { flash } = usePage().props as {
        flash?: { toast?: FlashToast | null };
    };
    const lastKey = useRef('');

    useEffect(() => {
        const data = flash?.toast;

        if (!data) {
            return;
        }

        const key = `${data.type}:${data.message}`;

        if (key === lastKey.current) {
            return;
        }

        lastKey.current = key;
        toast[data.type](data.message);
    }, [flash?.toast]);

    return null;
}
