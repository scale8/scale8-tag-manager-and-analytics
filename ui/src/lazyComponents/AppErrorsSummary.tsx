import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@mui/material';
import SummaryDetail from '../components/atoms/SummaryDetail';
import { buildSummaryDetailPropsFromValue, calculateEventsPerUser } from '../utils/AnalyticsUtils';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';
import AppSummaryQuery from '../gql/queries/AppSummaryQuery';
import { AppSummaryQueryData } from '../gql/generated/AppSummaryQueryData';
import { getAnalyticsPollingFrequencyMs } from '../utils/ConfigUtils';

const AppErrorsSummary: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const { appSummaryQueryOptions, appSummaryQueryOptionsPrev, id, refreshAt } = props;

    return QueryLoaderAndError<AppSummaryQueryData>(
        false,
        useQuery<AppSummaryQueryData>(AppSummaryQuery, {
            variables: {
                id,
                appQueryOptions: appSummaryQueryOptions,
                appQueryOptionsPrev: appSummaryQueryOptionsPrev,
            },
            pollInterval: getAnalyticsPollingFrequencyMs(),
        }),
        (queryData: AppSummaryQueryData) => {
            const errorResult =
                queryData.getApp.event_request_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.event_request_stats.result[0];

            const prevErrorResult =
                queryData.getApp.prev_request_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.prev_request_stats.result[0];

            return (
                <Box display="flex" flexWrap="wrap" width="100%">
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Users with errors',
                            errorResult.user_count,
                            prevErrorResult.user_count,
                            'number',
                            true,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            `Total errors`,
                            errorResult.event_count,
                            prevErrorResult.event_count,
                            'number',
                            true,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Errors per user',
                            calculateEventsPerUser(errorResult.event_count, errorResult.user_count),
                            calculateEventsPerUser(
                                prevErrorResult.event_count,
                                prevErrorResult.user_count,
                            ),
                            'number',
                            true,
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

export { AppErrorsSummary };
