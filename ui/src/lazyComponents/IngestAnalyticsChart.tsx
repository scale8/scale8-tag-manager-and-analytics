import { FC } from 'react';
import { Bar } from 'react-chartjs-2';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { IngestEndpointAnalyticsContentProps } from '../types/props/IngestEndpointAnalyticsContentProps';
import IngestChartQuery from '../gql/queries/IngestChartQuery';
import { IngestChartQueryData } from '../gql/generated/IngestChartQueryData';
import { getProductSection, ProductSectionKey } from '../containers/SectionsDetails';
import { ChartData, ChartOptions, ScriptableContext } from 'chart.js';
import { buildDemoEndpointChartVars, buildEndpointChartVars } from '../utils/GraphUtils';
import { getAnalyticsPollingFrequencyMs } from '../utils/ConfigUtils';

const IngestAnalyticsChart: FC<IngestEndpointAnalyticsContentProps> = (
    props: IngestEndpointAnalyticsContentProps,
) => {
    const { ingestQueryOptions, chartPeriodProps, id, refreshAt } = props;

    return QueryLoaderAndError<IngestChartQueryData>(
        false,
        useQuery<IngestChartQueryData>(IngestChartQuery, {
            variables: {
                id,
                ingestQueryOptions,
            },
            pollInterval: getAnalyticsPollingFrequencyMs(),
        }),
        (queryData: IngestChartQueryData) => {
            const { labels, ticksLimit, requestsChartData, bytesChartData } = process.env.demo
                ? buildDemoEndpointChartVars(queryData, chartPeriodProps)
                : buildEndpointChartVars(queryData, chartPeriodProps);

            const data: ChartData<'bar'> = {
                labels,
                datasets: [
                    {
                        label: 'Number of requests',
                        data: requestsChartData,

                        backgroundColor: process.env.demo
                            ? getProductSection(ProductSectionKey.dataManager).color
                            : (context: ScriptableContext<'bar'>) => {
                                  const chart = context.chart;
                                  const { ctx, chartArea } = chart;

                                  if (!chartArea) {
                                      // This case happens on initial chart load
                                      return;
                                  }

                                  const background = ctx.createLinearGradient(0, 0, 0, 600);
                                  background.addColorStop(
                                      0,
                                      getProductSection(ProductSectionKey.dataManager).color,
                                  );
                                  background.addColorStop(1, 'black');

                                  return background;
                              },
                        borderWidth: 0,
                        yAxisID: 'yAxis1',
                    },
                    ...(process.env.demo
                        ? []
                        : [
                              {
                                  label: 'Bytes transferred',
                                  data: bytesChartData,
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
                          ]),
                ],
            };

            const options: ChartOptions<'bar'> = {
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

export { IngestAnalyticsChart };
