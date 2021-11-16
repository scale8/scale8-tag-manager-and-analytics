import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import {
    chartDataFromGroupingCount,
    datesFromChartPeriod,
    labelsFromChartPeriod,
} from '../hooks/chart/useChartPeriod';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { IngestEndpointAnalyticsContentProps } from '../types/props/IngestEndpointAnalyticsContentProps';
import IngestChartQuery from '../gql/queries/IngestChartQuery';
import { IngestChartQueryData } from '../gql/generated/IngestChartQueryData';
import { getProductSection, ProductSectionKey } from '../containers/SectionsDetails';
import { ChartOptions } from 'chart.js';
import { ticksLimitFromPeriodType } from '../utils/GraphUtils';

const IngestAnalyticsChart: FC<IngestEndpointAnalyticsContentProps> = (
    props: IngestEndpointAnalyticsContentProps,
) => {
    const { ingestQueryOptions, chartPeriodProps, id, refreshAt } = props;

    return queryLoaderAndError<IngestChartQueryData>(
        false,
        useQuery<IngestChartQueryData>(IngestChartQuery, {
            variables: {
                id,
                ingestQueryOptions,
            },
        }),
        (queryData: IngestChartQueryData) => {
            const rangeFrom = queryData.getIngestEndpoint.request_stats.from as number;
            const rangeTo = queryData.getIngestEndpoint.request_stats.to as number;

            const labels = labelsFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
            const dates = datesFromChartPeriod(rangeFrom, rangeTo, chartPeriodProps.period);
            const ticksLimit = ticksLimitFromPeriodType(chartPeriodProps.period);

            const data = {
                labels,
                datasets: [
                    {
                        label: 'Number of requests',
                        data: chartDataFromGroupingCount(
                            dates,
                            queryData.getIngestEndpoint.request_stats.result,
                            chartPeriodProps.period,
                        ),
                        fill: false,
                        backgroundColor: getProductSection(ProductSectionKey.dataManager).color,
                        borderColor: getProductSection(ProductSectionKey.dataManager).color,
                        borderWidth: 3,
                        lineTension: 0,
                        yAxisID: 'yAxis1',
                    },
                    {
                        label: 'Bytes transferred',
                        data: chartDataFromGroupingCount(
                            dates,
                            queryData.getIngestEndpoint.byte_stats.result,
                            chartPeriodProps.period,
                        ),
                        fill: false,
                        backgroundColor: '#737373',
                        borderColor: '#737373',
                        borderWidth: 3,
                        lineTension: 0,
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
                    xAxes: {
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
                            text: 'Number of requests',
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
                            text: 'Bytes transferred',
                        },
                        ticks: {
                            precision: 0,
                        },
                        display: true,
                        position: 'right',
                    },
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

export { IngestAnalyticsChart };
