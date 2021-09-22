import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { QueryResult } from '@apollo/client/react/types/types';
import { ApolloError } from '@apollo/client';
import AfterLoadComponent from './AfterLoadComponent';
import { UTCTimestamp } from '../utils/DateTimeUtils';
import { useLoggedInState } from '../context/AppContext';
import { useRefresh } from '../hooks/useRefresh';

const queryLoaderAndError = <T extends any>(
    isPage: boolean,
    queryResult: QueryResult<T>,
    afterLoad: (
        data: T,
        valuesRefresh: (mustResetCache: boolean) => void,
        queryResult: QueryResult<T>,
    ) => ReactElement,
    noRefreshLoader = false,
    customLoader?: ReactNode,
    customError?: (error: ApolloError) => ReactNode,
    refreshAt?: UTCTimestamp,
): ReactElement => {
    const { templateInteractions, teleport } = useLoggedInState();
    const { refreshCurrentPage, setRefreshCurrentPage } = templateInteractions;

    const [refreshedAt, setRefreshedAt] = useState<UTCTimestamp | undefined>(undefined);

    useEffect(() => {
        if (isPage) {
            teleport('dialogErrorClose', <></>);
        }
    }, [isPage]);

    // Function to refresh the query result values
    const valuesRefresh = (mustResetCache: boolean) => {
        (async () => {
            if (mustResetCache) {
                await queryResult.client.cache.reset();
            }
            await queryResult.refetch();
        })();
    };

    useRefresh(
        refreshCurrentPage,
        setRefreshCurrentPage,
        isPage,
        valuesRefresh,
        refreshAt,
        refreshedAt,
        setRefreshedAt,
    );

    const { loading, error, data: freshData } = queryResult;

    return (
        <AfterLoadComponent
            {...{
                freshData,
                valuesRefresh,
                queryResult,
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

export { queryLoaderAndError };
