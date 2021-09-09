import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import {
    chartDataFromAppGroupingCount,
    ChartPeriodType,
    datesFromChartPeriod,
    labelsFromChartPeriod,
} from '../hooks/chart/useChartPeriod';
import AppChartQuery from '../gql/queries/AppChartQuery';
import { useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { AppChartQueryData } from '../gql/generated/AppChartQueryData';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { getEventLabel } from '../utils/AnalyticsUtils';

const ticksLimitFromPeriodType = (type: ChartPeriodType): number | undefined => {
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

const AppAnalyticsChart: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appQueryOptions, chartPeriodProps, id, refreshAt } = props;

    const eventLabel = getEventLabel(appQueryOptions);

    return queryLoaderAndError<AppChartQueryData>(
        false,
        useQuery<AppChartQueryData>(AppChartQuery, {
            variables: {
                id,
                appQueryOptions,
            },
        }),
        (queryData: AppChartQueryData) => {
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

            const data = {
                labels,
                datasets: [
                    {
                        label: 'Unique visitors',
                        data: chartData.map((_) => _.user_count),
                        fill: false,
                        backgroundColor: '#39cce0',
                        borderColor: '#39cce0',
                        borderWidth: 3,
                        lineTension: 0,
                        yAxisID: 'y-axis-1',
                    },
                    {
                        label: `${eventLabel} Events`,
                        data: chartData.map((_) => _.event_count),
                        fill: false,
                        backgroundColor: '#737373',
                        borderColor: '#737373',
                        borderWidth: 3,
                        lineTension: 0,
                        yAxisID: 'y-axis-2',
                    },
                ],
            };

            const options = {
                showAllTooltips: true,
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    xAxes: [
                        {
                            scaleLabel: {
                                display: false,
                            },
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: ticksLimit,
                            },
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: 'Unique visitors',
                            },
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                            type: 'linear',
                            display: true,
                            position: 'left',
                            id: 'y-axis-1',
                        },
                        {
                            scaleLabel: {
                                display: true,
                                labelString: `${eventLabel} Events`,
                            },
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                            },
                            type: 'linear',
                            display: true,
                            position: 'right',
                            id: 'y-axis-2',
                        },
                    ],
                },
            };

            return (
                <Box height="400px" width="100%" overflow="auto">
                    <Bar data={data} options={options} />
                </Box>
            );
        },
        true,
        undefined,
        (error: ApolloError) => (
            <Box width="100%" mr={1}>
                <GQLError error={error} />
            </Box>
        ),
        refreshAt,
    );
};

export { AppAnalyticsChart };
