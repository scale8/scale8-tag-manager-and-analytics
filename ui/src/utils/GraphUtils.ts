import {
    chartDataFromAppGroupingCount,
    ChartPeriodProps,
    ChartPeriodType,
    datesFromChartPeriod,
    labelsFromChartPeriod,
} from '../hooks/chart/useChartPeriod';
import { AppChartQueryData } from '../gql/generated/AppChartQueryData';

export const ticksLimitFromPeriodType = (type: ChartPeriodType): number | undefined => {
    switch (type) {
        case 'day':
            return 6;
        case 'realtime':
        case 'custom':
            return 8;
        case '30d':
        case 'month':
            return 10;
        default:
            return undefined;
    }
};

export const buildAppChartVars = (
    queryData: AppChartQueryData,
    chartPeriodProps: ChartPeriodProps,
) => {
    const rangeFrom = queryData.getApp.event_request_stats.from as number;
    const rangeTo = queryData.getApp.event_request_stats.to as number;

    const labels = labelsFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const dates = datesFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const ticksLimit = ticksLimitFromPeriodType(chartPeriodProps.period);

    const chartData = chartDataFromAppGroupingCount(
        dates,
        queryData.getApp.event_request_stats.result,
        chartPeriodProps.period,
    );

    return { labels, ticksLimit, chartData };
};
