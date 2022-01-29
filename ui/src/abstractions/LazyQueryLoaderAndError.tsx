import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { QueryTuple } from '@apollo/client/react/types/types';
import { ApolloError } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import AfterLazyLoadComponent from './AfterLazyLoadComponent';
import { UTCTimestamp } from '../utils/DateTimeUtils';
import { useLoggedInState } from '../context/AppContext';
import { useRefresh } from '../hooks/useRefresh';

const LazyQueryLoaderAndError = <T,>(
    isPage: boolean,
    lazyQuery: QueryTuple<any, any>,
    lazyQueryVariables: OperationVariables,
    afterLoad: (data: T, valuesRefresh: (mustResetCache: boolean) => void) => ReactElement,
    noRefreshLoader = false,
    customLoader?: ReactNode,
    customError?: (error: ApolloError) => ReactNode,
    refreshAt?: UTCTimestamp,
): ReactElement => {
    const { templateInteractions } = useLoggedInState();
    const { refreshCurrentPage, setRefreshCurrentPage } = templateInteractions;

    const [refreshedAt, setRefreshedAt] = useState<UTCTimestamp | undefined>(undefined);

    const [fetch, { loading, error, data: freshData, client }] = lazyQuery;

    // Function to refresh the query result values
    const valuesRefresh = (mustResetCache: boolean) => {
        (async () => {
            if (mustResetCache && client !== undefined) {
                await client.cache.reset();
            }
            await fetch(lazyQueryVariables);
        })();
    };

    useEffect(() => {
        (async () => {
            await fetch(lazyQueryVariables);
        })();
    }, [JSON.stringify(lazyQueryVariables)]);

    useRefresh(
        refreshCurrentPage,
        setRefreshCurrentPage,
        isPage,
        valuesRefresh,
        refreshAt,
        refreshedAt,
        setRefreshedAt,
    );

    return (
        <AfterLazyLoadComponent
            {...{
                freshData,
                valuesRefresh,
                loading,
                error,
                afterLoad,
                noRefreshLoader,
                customLoader,
                customError,
            }}
        />
    );
};

export { LazyQueryLoaderAndError };
