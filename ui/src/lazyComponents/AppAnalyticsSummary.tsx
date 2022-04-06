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
import { QueryLoaderAndError } from '../abstractions/QueryLoaderAndError';

const AppAnalyticsSummary: FC<AppAnalyticsContentProps> = (props: AppAnalyticsContentProps) => {
    const { appSummaryQueryOptions, appSummaryQueryOptionsPrev, id, refreshAt } = props;

    const eventLabel = getEventLabel(appSummaryQueryOptions);

    return QueryLoaderAndError<AppSummaryQueryData>(
        false,
        useQuery<AppSummaryQueryData>(AppSummaryQuery, {
            variables: {
                id,
                appQueryOptions: appSummaryQueryOptions,
                appQueryOptionsPrev: appSummaryQueryOptionsPrev,
            },
        }),
        (queryData: AppSummaryQueryData) => {
            const eventRequestResult = (() => {
                if (process.env.demo) {
                    return {
                        event_count: 57869,
                        user_count: 30465,
                    };
                }
                if (queryData.getApp.event_request_stats.result.length === 0) {
                    return {
                        event_count: 0,
                        user_count: 0,
                    };
                }
                return queryData.getApp.event_request_stats.result[0];
            })();

            const prevEventRequestResult = (() => {
                if (process.env.demo) {
                    return {
                        event_count: 47678,
                        user_count: 27568,
                    };
                }
                if (queryData.getApp.prev_request_stats.result.length === 0) {
                    return {
                        event_count: 0,
                        user_count: 0,
                    };
                }
                return queryData.getApp.prev_request_stats.result[0];
            })();

            const bounceRateResults = (() => {
                if (process.env.demo) {
                    return {
                        current: 14,
                        prev: 12,
                    };
                }
                return {
                    current: queryData.getApp.bounce_ratio_stats.result,
                    prev: queryData.getApp.prev_bounce_ratio.result,
                };
            })();

            const visitDuration = (() => {
                if (process.env.demo) {
                    return {
                        current: 67,
                        prev: 45,
                    };
                }
                return {
                    current: queryData.getApp.average_session_duration_stats.result,
                    prev: queryData.getApp.prev_average_session_duration.result,
                };
            })();

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
                            bounceRateResults.current,
                            bounceRateResults.prev,
                            'percentage',
                            true,
                        )}
                    />
                    <SummaryDetail
                        {...buildSummaryDetailPropsFromValue(
                            'Visit duration',
                            visitDuration.current,
                            visitDuration.prev,
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
