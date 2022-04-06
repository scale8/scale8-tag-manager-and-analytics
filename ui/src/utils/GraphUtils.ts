import {
    chartDataFromAppGroupingCount,
    chartDataFromGroupingCount,
    ChartPeriodProps,
    ChartPeriodType,
    datesFromChartPeriod,
    labelsFromChartPeriod,
} from '../hooks/chart/useChartPeriod';
import { AppChartQueryData } from '../gql/generated/AppChartQueryData';
import { IngestChartQueryData } from '../gql/generated/IngestChartQueryData';

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

export const buildEndpointChartVars = (
    queryData: IngestChartQueryData,
    chartPeriodProps: ChartPeriodProps,
) => {
    const rangeFrom = queryData.getIngestEndpoint.request_stats.from as number;
    const rangeTo = queryData.getIngestEndpoint.request_stats.to as number;

    const labels = labelsFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const dates = datesFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const ticksLimit = ticksLimitFromPeriodType(chartPeriodProps.period);

    const requestsChartData = chartDataFromGroupingCount(
        dates,
        queryData.getIngestEndpoint.request_stats.result,
        chartPeriodProps.period,
    );
    const bytesChartData = chartDataFromGroupingCount(
        dates,
        queryData.getIngestEndpoint.byte_stats.result,
        chartPeriodProps.period,
    );

    return { labels, ticksLimit, requestsChartData, bytesChartData };
};

export const randomIntFromInterval = (min: number, max: number) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const buildDemoAppChartVars = (
    queryData: AppChartQueryData,
    chartPeriodProps: ChartPeriodProps,
) => {
    const rangeFrom = queryData.getApp.event_request_stats.from as number;
    const rangeTo = queryData.getApp.event_request_stats.to as number;

    const labels = labelsFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const dates = datesFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const ticksLimit = ticksLimitFromPeriodType(chartPeriodProps.period);

    const chartData = dates.map(() => {
        const userCount = randomIntFromInterval(100, 1000);
        const eventDelta = randomIntFromInterval(100, 1000);
        return {
            user_count: userCount,
            event_count: userCount + eventDelta,
        };
    });

    return { labels, ticksLimit, chartData };
};

export const buildDemoEndpointChartVars = (
    queryData: IngestChartQueryData,
    chartPeriodProps: ChartPeriodProps,
) => {
    const rangeFrom = queryData.getIngestEndpoint.request_stats.from as number;
    const rangeTo = queryData.getIngestEndpoint.request_stats.to as number;

    const labels = labelsFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const dates = datesFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
    const ticksLimit = ticksLimitFromPeriodType(chartPeriodProps.period);

    const requestsChartData = dates.map(() => randomIntFromInterval(100, 1000));
    const bytesChartData = dates.map(() => randomIntFromInterval(100, 1000));

    return { labels, ticksLimit, requestsChartData, bytesChartData };
};
