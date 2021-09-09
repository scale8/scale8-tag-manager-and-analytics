import { stringToUTCTimestamp, UTCTimestamp } from './DateTimeUtils';
import { AppGroupingCount, GroupingCount } from './AnalyticsUtils';
import {
    chartDataFromAppGroupingCount,
    chartDataFromGroupingCount,
    chartPeriodToFilterRange,
    datesFromChartPeriod,
} from '../hooks/chart/useChartPeriod';
import { AppQueryOptions, IngestQueryOptions, TimeSlice } from '../gql/generated/globalTypes';

const groupingCountToSparkData = (
    rangeFrom: UTCTimestamp,
    rangeTo: UTCTimestamp,
    groupingCountsResult: GroupingCount[],
): number[] => {
    const dates = datesFromChartPeriod(rangeFrom, rangeTo, '30d');

    return chartDataFromGroupingCount(dates, groupingCountsResult, '30d');
};

const appGroupingCountToSparkData = (
    rangeFrom: UTCTimestamp,
    rangeTo: UTCTimestamp,
    groupingCountsResult: AppGroupingCount[],
    uniques = false,
): number[] => {
    const dates = datesFromChartPeriod(rangeFrom, rangeTo, '30d');

    return chartDataFromAppGroupingCount(dates, groupingCountsResult, '30d').map((_) =>
        uniques ? _.user_count : _.event_count,
    );
};

const buildSparkQueryOptions = (ingest?: boolean): AppQueryOptions | IngestQueryOptions => {
    return {
        time_slice: TimeSlice.DAY,
        filter_options: {
            ...chartPeriodToFilterRange({ period: '30d' }),
            ...(ingest ? {} : { event: 'page-view' }),
        },
    };
};

export {
    stringToUTCTimestamp,
    groupingCountToSparkData,
    appGroupingCountToSparkData,
    buildSparkQueryOptions,
};
