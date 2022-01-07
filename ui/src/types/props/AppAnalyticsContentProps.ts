import { AppQueryFilterOptions, AppQueryOptions } from '../../gql/generated/globalTypes';
import { ChartPeriodProps } from '../../hooks/chart/useChartPeriod';
import { UTCTimestamp } from '../../utils/DateTimeUtils';

export type AppQueryFilters = Omit<AppQueryFilterOptions, 'from' | 'to'>;

export type AppAnalyticsContentProps = {
    chartPeriodProps: ChartPeriodProps;
    setFilter: (key: string, value: string | boolean | undefined) => void;
    setEventGroup: (value: string | undefined) => void;
    referrerTLD?: string;
    appQueryOptions: AppQueryOptions;
    appSummaryQueryOptions: AppQueryOptions;
    appSummaryQueryOptionsPrev: AppQueryOptions;
    appSummaryQueryOptionsCurrent: AppQueryOptions;
    id: string;
    refreshAt?: UTCTimestamp;
    checkTags: boolean;
};
