import { AppQueryOptions } from '../../gql/generated/globalTypes';
import { ChartPeriodProps } from '../../hooks/chart/useChartPeriod';
import { UTCTimestamp } from '../../utils/DateTimeUtils';
import { Dispatch, SetStateAction } from 'react';
import { AppQueryFilters } from './AppAnalyticsContentProps';

export type AppErrorContentProps = {
    chartPeriodProps: ChartPeriodProps;
    setFilter: (key: string, value: string | boolean | undefined) => void;
    filters: AppQueryFilters;
    setFilters: Dispatch<SetStateAction<AppQueryFilters>>;
    appQueryOptions: AppQueryOptions;
    appSummaryQueryOptions: AppQueryOptions;
    appSummaryQueryOptionsPrev: AppQueryOptions;
    appSummaryQueryOptionsCurrent: AppQueryOptions;
    id: string;
    refreshAt?: UTCTimestamp;
};
