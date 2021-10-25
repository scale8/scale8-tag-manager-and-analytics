import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import {
    chartDataFromGroupingCount,
    ChartPeriodType,
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
                        yAxisID: 'y-axis-1',
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
                                labelString: 'Number of requests',
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
                                labelString: 'Bytes transferred',
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

export { IngestAnalyticsChart };
