import { IngestQueryOptions } from '../../gql/generated/globalTypes';
import { ChartPeriodProps } from '../../hooks/chart/useChartPeriod';
import { UTCTimestamp } from '../../utils/DateTimeUtils';

export type IngestEndpointAnalyticsContentProps = {
    chartPeriodProps: ChartPeriodProps;
    ingestQueryOptions: IngestQueryOptions;
    ingestSummaryQueryOptions: IngestQueryOptions;
    ingestSummaryQueryOptionsPrev: IngestQueryOptions;
    id: string;
    refreshAt?: UTCTimestamp;
};
