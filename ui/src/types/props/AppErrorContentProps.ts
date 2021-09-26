import { AppQueryOptions } from '../../gql/generated/globalTypes';
import { ChartPeriodProps } from '../../hooks/chart/useChartPeriod';
import { UTCTimestamp } from '../../utils/DateTimeUtils';

export type AppErrorContentProps = {
    chartPeriodProps: ChartPeriodProps;
    setFilter: (key: string, value: string | boolean | undefined) => void;
    appQueryOptions: AppQueryOptions;
    appSummaryQueryOptions: AppQueryOptions;
    appSummaryQueryOptionsPrev: AppQueryOptions;
    appSummaryQueryOptionsCurrent: AppQueryOptions;
    id: string;
    refreshAt?: UTCTimestamp;
};
