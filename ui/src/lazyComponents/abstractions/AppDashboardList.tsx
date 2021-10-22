import { FC } from 'react';
import { QueryTuple } from '@apollo/client/react/types/types';
import { OperationVariables } from '@apollo/client/core';
import { lazyQueryLoaderAndError } from '../../abstractions/LazyQueryLoaderAndError';
import { AppGroupingCount } from '../../utils/AnalyticsUtils';
import { UTCTimestamp } from '../../utils/DateTimeUtils';
import { NoRecordsMessage } from '../../components/atoms/NoRecordsMessage';
import { AppDashboardListContent } from '../../components/organisms/AppDashboardListContent';

export type GroupingCount = {
    key: string;
    count: number;
};

export type DashboardListProps = {
    forErrors: boolean;
    textTitle: string;
    lazyQuery: QueryTuple<any, any>;
    eventLabel: string;
    lazyQueryVariables: OperationVariables;
    extractList: (queryData: any) => AppGroupingCount[];
    addFilter?: (value: string) => void;
    useSourceIcon?: boolean;
    allowFilterOnSingleEntity?: boolean;
    refreshAt: UTCTimestamp | undefined;
};

const AppDashboardList: FC<DashboardListProps> = (props: DashboardListProps) => {
    return lazyQueryLoaderAndError(
        false,
        props.lazyQuery,
        props.lazyQueryVariables,
        (queryData: GroupingCount) => {
            const list = props.extractList(queryData);

            const total = list.reduce((t, v) => {
                return t + v.event_count;
            }, 0);

            if (total === 0) {
                return <NoRecordsMessage />;
            }

            return <AppDashboardListContent list={list} total={total} {...props} />;
        },
        true,
        undefined,
        undefined,
        props.refreshAt,
    );
};

export { AppDashboardList };
