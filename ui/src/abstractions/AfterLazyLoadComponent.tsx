import { FC, ReactElement, ReactNode, useState } from 'react';
import GQLError from '../components/atoms/GqlError';
import Loader from '../components/organisms/Loader';
import { ApolloError } from '@apollo/client';
import { ValuesRefreshFunction } from '../types/GqlTypes';

type AfterLazyLoadComponentProps = {
    freshData: any;
    valuesRefresh: ValuesRefreshFunction;
    loading: boolean;
    error: ApolloError | undefined;
    afterLoad: (data: any, valuesRefresh: (mustResetCache: boolean) => void) => ReactElement;
    noRefreshLoader: boolean;
    customLoader?: ReactNode;
    customError?: (error: ApolloError) => ReactNode;
};

const AfterLazyLoadComponent: FC<AfterLazyLoadComponentProps> = (
    props: AfterLazyLoadComponentProps,
) => {
    const {
        freshData,
        loading,
        error,
        valuesRefresh,
        afterLoad,
        noRefreshLoader,
        customLoader,
        customError,
    } = props;

    const [data, setData] = useState<any | undefined>(undefined);

    if (error) {
        return customError ? <>{customError(error)}</> : <GQLError error={error} />;
    }

    if (noRefreshLoader) {
        if (freshData !== undefined && JSON.stringify(data) !== JSON.stringify(freshData)) {
            setData(freshData);
        }

        if (!data) {
            return customLoader ? <>{customLoader}</> : <Loader />;
        }

        return afterLoad(data, valuesRefresh);
    } else {
        if (loading || !freshData) {
            return customLoader ? <>{customLoader}</> : <Loader />;
        }

        return afterLoad(freshData, valuesRefresh);
    }
};

export default AfterLazyLoadComponent;
