import * as React from 'react';
import { FC, useEffect } from 'react';
import Loader from '../../organisms/Loader';
import { useRouter } from 'next/router';

type NavigateProps = {
    to: string;
};

const Navigate: FC<NavigateProps> = (props: NavigateProps) => {
    const router = useRouter();

    useEffect(() => {
        router.push(props.to).then();
    });

    return <Loader />;
};
export default Navigate;
