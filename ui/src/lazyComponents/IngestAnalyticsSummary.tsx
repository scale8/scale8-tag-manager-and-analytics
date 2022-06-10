import { FC } from 'react';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@mui/material';
import SummaryDetail from '../components/atoms/SummaryDetail';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { IngestEndpointAnalyticsContentProps } from '../types/props/IngestEndpointAnalyticsContentProps';
import { IngestSummaryQueryData } from '../gql/generated/IngestSummaryQueryData';
import IngestSummaryQuery from '../gql/queries/IngestSummaryQuery';
import { buildSummaryDetailPropsFromValue } from '../utils/AnalyticsUtils';
import { getAnalyticsPollingFrequency } from '../utils/ConfigUtils';

const IngestAnalyticsSummary: FC<IngestEndpointAnalyticsContentProps> = (
    props: IngestEndpointAnalyticsContentProps,
) => {
    const { ingestSummaryQueryOptions, ingestSummaryQueryOptionsPrev, id, refreshAt } = props;

    return QueryLoaderAndError<IngestSummaryQueryData>(
        false,
        useQuery<IngestSummaryQueryData>(IngestSummaryQuery, {
            variables: {
                id,
                ingestQueryOptions: ingestSummaryQueryOptions,
                ingestQueryOptionsPrev: ingestSummaryQueryOptionsPrev,
            },
            pollInterval: getAnalyticsPollingFrequency(),
        }),
        (queryData: IngestSummaryQueryData) => {
            const requestsResult = (() => {
                if (process.env.demo) {
                    return {
                        requests: 37869,
                        prevRequests: 20465,
                    };
                }

                return {
                    requests:
                        queryData.getIngestEndpoint.request_stats.result.length === 0
                            ? 0
                            : queryData.getIngestEndpoint.request_stats.result[0].count,
                    prevRequests:
                        queryData.getIngestEndpoint.prev_request_stats.result.length === 0
                            ? 0
                            : queryData.getIngestEndpoint.prev_request_stats.result[0].count,
                };
            })();

            const bytesResult = (() => {
                if (process.env.demo) {
                    return {
                        bytes: 256000,
                        prevBytes: 127000,
                    };
                }

                return {
                    bytes:
                        queryData.getIngestEndpoint.byte_stats.result.length === 0
                            ? 0
                            : queryData.getIngestEndpoint.byte_stats.result[0].count,
                    prevBytes:
                        queryData.getIngestEndpoint.prev_byte_stats.result.length === 0
                            ? 0
                            : queryData.getIngestEndpoint.prev_byte_stats.result[0].count,
                };
            })();

            return (
                <Box display="flex" flexWrap="wrap" width="100%">
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Number of requests',
                            requestsResult.requests,
                            requestsResult.prevRequests,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Bytes transferred',
                            bytesResult.bytes,
                            bytesResult.prevBytes,
                        )}
                    />
                </Box>
            );
        },
        true,
        <Box height="70px" width="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="inherit" />
        </Box>,
        (error: ApolloError) => (
            <Box width="100%">
                <GQLError error={error} />
            </Box>
        ),
        refreshAt,
    );
};

export { IngestAnalyticsSummary };
