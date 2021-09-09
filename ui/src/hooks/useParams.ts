import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useParams = (): NodeJS.Dict<string> => {
    const router = useRouter();
    const [params, setParams] = useState<NodeJS.Dict<string | string[]>>({});

    useEffect(() => {
        setParams(router.query);
    }, [router.query]);

    return params as NodeJS.Dict<string>;
};
