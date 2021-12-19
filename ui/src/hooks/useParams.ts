import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useParams = (): NodeJS.Dict<string> | null => {
    const router = useRouter();

    const [params, setParams] = useState<NodeJS.Dict<string | string[]> | null>(null);

    useEffect(() => {
        if (router.isReady) {
            setParams(router.query);
        }
    }, [router.query, router.isReady]);

    return params as NodeJS.Dict<string> | null;
};
