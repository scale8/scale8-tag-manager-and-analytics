import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@material-ui/core';
import SummaryDetail from '../components/atoms/SummaryDetail';
import { buildSummaryDetailPropsFromValue, calculateEventsPerUser } from '../utils/AnalyticsUtils';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { AppErrorContentProps } from '../types/props/AppErrorContentProps';
import { AppErrorsSummaryQueryData } from '../gql/generated/AppErrorsSummaryQueryData';
import AppErrorsSummaryQuery from '../gql/queries/AppErrorsSummaryQuery';

const AppErrorsSummary: FC<AppErrorContentProps> = (props: AppErrorContentProps) => {
    const { appSummaryQueryOptions, appSummaryQueryOptionsPrev, id, refreshAt } = props;

    return queryLoaderAndError<AppErrorsSummaryQueryData>(
        false,
        useQuery<AppErrorsSummaryQueryData>(AppErrorsSummaryQuery, {
            variables: {
                id,
                appQueryOptions: appSummaryQueryOptions,
                appQueryOptionsPrev: appSummaryQueryOptionsPrev,
            },
        }),
        (queryData: AppErrorsSummaryQueryData) => {
            const errorResult =
                queryData.getApp.error_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.error_stats.result[0];

            const prevErrorResult =
                queryData.getApp.prev_error_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.prev_error_stats.result[0];

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
