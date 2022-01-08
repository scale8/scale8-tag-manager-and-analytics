import * as React from 'react';
import { FC, useEffect } from 'react';
import Loader from '../../organisms/Loader';
import { useRouter } from 'next/router';
import { useLoggedInState } from '../../../context/AppContext';
import { ApolloError } from '@apollo/client/errors';

type NavigateWithErrorProps = {
    to: string;
    error: string;
};

const NavigateWithError: FC<NavigateWithErrorProps> = (props: NavigateWithErrorProps) => {
    const { templateInteractions } = useLoggedInState();
    const { setSnackbarError } = templateInteractions;

    const router = useRouter();

    useEffect(() => {
        setSnackbarError({
            message: props.error,
        } as ApolloError);

        router.push(props.to).then();
    }, []);

    return <Loader />;
};
export default NavigateWithError;
