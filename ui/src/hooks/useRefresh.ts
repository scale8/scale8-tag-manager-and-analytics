import { Dispatch, SetStateAction, useEffect } from 'react';
import { UTCTimestamp } from '../utils/DateTimeUtils';

export const useRefresh = (
    refreshCurrentPage: boolean,
    setRefreshCurrentPage: Dispatch<SetStateAction<boolean>>,
    isPage: boolean,
    valuesRefresh: (mustResetCache: boolean) => void,
    refreshAt: UTCTimestamp | undefined,
    refreshedAt: UTCTimestamp | undefined,
    setRefreshedAt: Dispatch<SetStateAction<UTCTimestamp | undefined>>,
): void => {
    useEffect(() => {
        if (refreshCurrentPage && isPage) {
            valuesRefresh(true);
            setRefreshCurrentPage(false);
        }
    }, [refreshCurrentPage, isPage]);

    useEffect(() => {
        if (refreshAt !== undefined || refreshAt !== refreshedAt) {
            valuesRefresh(true);
            setRefreshedAt(refreshAt);
        }
    }, [refreshAt]);
};
