import { AppQueryFilterOptions, AppQueryOptions } from '../../gql/generated/globalTypes';
import { ChartPeriodProps } from '../../hooks/chart/useChartPeriod';
import { UTCTimestamp } from '../../utils/DateTimeUtils';
import { Dispatch, SetStateAction } from 'react';

export type AppQueryFilters = Omit<AppQueryFilterOptions, 'from' | 'to'>;

export type AppAnalyticsContentProps = {
    chartPeriodProps: ChartPeriodProps;
    setFilter: (key: string, value: string | boolean | undefined) => void;
    setFilters: Dispatch<SetStateAction<AppQueryFilters>>;
    setEventGroup: (value: string | undefined) => void;
    referrerTLD?: string;
    appQueryOptions: AppQueryOptions;
    appSummaryQueryOptions: AppQueryOptions;
    appSummaryQueryOptionsPrev: AppQueryOptions;
    appSummaryQueryOptionsCurrent: AppQueryOptions;
    id: string;
    refreshNow: () => void;
    refreshAt?: UTCTimestamp;
    ticks: number;
};
