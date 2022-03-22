import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';

import AppChartQuery from '../gql/queries/AppChartQuery';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { AppChartQueryData } from '../gql/generated/AppChartQueryData';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { getEventLabel } from '../utils/AnalyticsUtils';
import { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
import { buildAppChartVars } from '../utils/GraphUtils';

const AppAnalyticsChart: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appQueryOptions, chartPeriodProps, id, refreshAt } = props;

    const eventLabel = getEventLabel(appQueryOptions);

    return QueryLoaderAndError<AppChartQueryData>(
        false,
        useQuery<AppChartQueryData>(AppChartQuery, {
            variables: {
                id,
                appQueryOptions,
            },
        }),
        (queryData: AppChartQueryData) => {
            const { labels, ticksLimit, chartData } = buildAppChartVars(
                queryData,
                chartPeriodProps,
            );

            const data: ChartData<'bar'> = {
                labels,
                datasets: [
                    {
                        label: 'Unique visitors',
                        data: chartData.map((_) => _.user_count),
                        // backgroundColor: '#39cce0',
                        backgroundColor: (context: ScriptableContext<'bar'>) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;

                            if (!chartArea) {
                                // This case happens on initial chart load
                                return;
                            }

                            const background = ctx.createLinearGradient(0, 0, 0, 600);
                            background.addColorStop(0, '#39cce0');
                            background.addColorStop(1, 'black');

                            return background;
                        },
                    },
                    {
                        label: `${eventLabel} Events`,
                        data: chartData.map((_) => _.event_count),
                        backgroundColor: (context: ScriptableContext<'bar'>) => {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;

                            if (!chartArea) {
                                // This case happens on initial chart load
                                return;
                            }

                            const background = ctx.createLinearGradient(0, 0, 0, 600);
                            background.addColorStop(0, '#bbbbbb');
                            background.addColorStop(1, 'black');

                            return background;
                        },
                        borderWidth: 0,
                        yAxisID: 'yAxis2',
                    },
                ],
            };

            const options: ChartOptions<'bar'> = {
                // plugins: {
                //     tooltip: {
                //         enabled: true,
                //     },
                // },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    xAxis: {
                        title: {
                            display: false,
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: ticksLimit,
                        },
                        grid: {
                            display: false,
                        },
                    },
                    yAxis1: {
                        type: 'linear',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Unique visitors',
                        },
                        ticks: {
                            precision: 0,
                        },
                        display: true,
                        position: 'left',
                    },
                    yAxis2: {
                        type: 'linear',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: `${eventLabel} Events`,
                        },
                        ticks: {
                            precision: 0,
                        },
                        display: true,
                        position: 'right',
                    },
                },
            };

            // noinspection RequiredAttributes
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
