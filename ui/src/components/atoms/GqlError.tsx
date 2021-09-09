import { FC, MouseEvent, SyntheticEvent, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { isAuthenticationError } from '../../utils/ErrorsUtils';
import IconAlignedAlert from './IconAlignedAlert';
import Navigate from './Next/Navigate';
import { toLogin } from '../../utils/NavigationPaths';
import { useLoggedInState } from '../../context/AppContext';
import { logError } from '../../utils/logUtils';

type GqlErrorProps = {
    error: ApolloError;
    onClose?: (event: SyntheticEvent | MouseEvent, reason?: string) => void;
};

const GqlError: FC<GqlErrorProps> = (props: GqlErrorProps) => {
    const { graphQLErrors, networkError } = props.error;

    const { gates } = useLoggedInState();

    useEffect(() => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) =>
                logError(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ),
            );

        if (networkError) logError(`[Network error]: ${networkError}`);
    }, [graphQLErrors, networkError]);

    return isAuthenticationError(props.error) ? (
        <Navigate to={toLogin} />
    ) : (
        <>
            <IconAlignedAlert className="errorBox" severity="error" onClose={props.onClose}>
                {props.error.message}
            </IconAlignedAlert>
            {gates['dialogErrorClose'] ?? <></>}
        </>
    );
};

export default GqlError;
