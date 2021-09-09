import { FC, ReactElement, ReactNode, useState } from 'react';
import GQLError from '../components/atoms/GqlError';
import Loader from '../components/organisms/Loader';
import { ApolloError } from '@apollo/client';
import { ValuesRefreshFunction } from '../types/GqlTypes';
import { QueryResult } from '@apollo/client/react/types/types';

type AfterLoadComponentProps = {
    freshData: any;
    valuesRefresh: ValuesRefreshFunction;
    loading: boolean;
    queryResult: QueryResult;
    error: ApolloError | undefined;
    afterLoad: (
        data: any,
        valuesRefresh: (mustResetCache: boolean) => void,
        queryResult: QueryResult,
    ) => ReactElement;
    noRefreshLoader: boolean;
    customLoader?: ReactNode;
    customError?: (error: ApolloError) => ReactNode;
};

const AfterLoadComponent: FC<AfterLoadComponentProps> = (props: AfterLoadComponentProps) => {
    const {
        freshData,
        loading,
        error,
        valuesRefresh,
        afterLoad,
        queryResult,
        noRefreshLoader,
        customLoader,
        customError,
    } = props;

    const [data, setData] = useState<any | undefined>(undefined);

    if (error) {
        return customError ? <>{customError(error)}</> : <GQLError error={error} />;
    }

    if (noRefreshLoader) {
        if (JSON.stringify(data) !== JSON.stringify(freshData)) {
            setData(freshData);
        }

        if (!data) {
            return customLoader ? <>{customLoader}</> : <Loader />;
        }

        return afterLoad(data, valuesRefresh, queryResult);
    } else {
        if (loading || !freshData) {
            return customLoader ? <>{customLoader}</> : <Loader />;
        }
        return afterLoad(freshData, valuesRefresh, queryResult);
    }
};

export default AfterLoadComponent;
