import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@mui/material';
import SummaryDetail from '../components/atoms/SummaryDetail';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import AppSummaryQuery from '../gql/queries/AppSummaryQuery';
import { AppSummaryQueryData } from '../gql/generated/AppSummaryQueryData';
import {
    buildSummaryDetailPropsFromValue,
    calculateEventsPerUser,
    getEventLabel,
} from '../utils/AnalyticsUtils';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';

const AppAnalyticsSummary: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appSummaryQueryOptions, appSummaryQueryOptionsPrev, id, refreshAt } = props;

    const eventLabel = getEventLabel(appSummaryQueryOptions);

    return queryLoaderAndError<AppSummaryQueryData>(
        false,
        useQuery<AppSummaryQueryData>(AppSummaryQuery, {
            variables: {
                id,
                appQueryOptions: appSummaryQueryOptions,
                appQueryOptionsPrev: appSummaryQueryOptionsPrev,
            },
        }),
        (queryData: AppSummaryQueryData) => {
            const eventRequestResult =
                queryData.getApp.event_request_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.event_request_stats.result[0];

            const prevEventRequestResult =
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
                            'Unique visitors',
                            eventRequestResult.user_count,
                            prevEventRequestResult.user_count,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            `${eventLabel} Events`,
                            eventRequestResult.event_count,
                            prevEventRequestResult.event_count,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Events per user',
                            calculateEventsPerUser(
                                eventRequestResult.event_count,
                                eventRequestResult.user_count,
                            ),
                            calculateEventsPerUser(
                                prevEventRequestResult.event_count,
                                prevEventRequestResult.user_count,
                            ),
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Bounce rate',
                            queryData.getApp.bounce_ratio_stats.result,
                            queryData.getApp.prev_bounce_ratio.result,
                            'percentage',
                            true,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Visit duration',
                            queryData.getApp.average_session_duration_stats.result,
                            queryData.getApp.prev_average_session_duration.result,
                            'time',
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

export { AppAnalyticsSummary };
