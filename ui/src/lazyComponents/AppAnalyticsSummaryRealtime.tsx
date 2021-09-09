import { FC } from 'react';
import { queryLoaderAndError } from '../abstractions/QueryLoaderAndError';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress } from '@material-ui/core';
import { AppAnalyticsContentProps } from '../types/props/AppAnalyticsContentProps';
import { ApolloError } from '@apollo/client/errors';
import GQLError from '../components/atoms/GqlError';
import AppSummaryRealtimeQuery from '../gql/queries/AppSummaryRealtimeQuery';
import { AppSummaryRealtimeQueryData } from '../gql/generated/AppSummaryRealtimeQueryData';
import { abbreviateNumber } from '../utils/TextUtils';
import SummaryDetail from '../components/atoms/SummaryDetail';
import {
    buildSummaryDetailPropsFromValue,
    calculateEventsPerUser,
    getEventLabel,
} from '../utils/AnalyticsUtils';

const AppAnalyticsSummaryRealtime: FC<AppAnalyticsContentProps> = (
    props: AppAnalyticsContentProps,
) => {
    const {
        appSummaryQueryOptions,
        appSummaryQueryOptionsPrev,
        appSummaryQueryOptionsCurrent,
        id,
        refreshAt,
    } = props;

    const eventLabel = getEventLabel(appSummaryQueryOptions);

    return queryLoaderAndError<AppSummaryRealtimeQueryData>(
        false,
        useQuery<AppSummaryRealtimeQueryData>(AppSummaryRealtimeQuery, {
            variables: {
                id,
                appQueryOptions: appSummaryQueryOptions,
                appQueryOptionsPrev: appSummaryQueryOptionsPrev,
                appQueryOptionsCurrent: appSummaryQueryOptionsCurrent,
            },
        }),
        (queryData: AppSummaryRealtimeQueryData) => {
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

            const currentEventRequestResult =
                queryData.getApp.current_request_stats.result.length === 0
                    ? {
                          event_count: 0,
                          user_count: 0,
                      }
                    : queryData.getApp.current_request_stats.result[0];

            return (
                <Box display="flex" flexWrap="wrap" width="100%">
                    <SummaryDetail
                        title="Current visitors"
                        value={abbreviateNumber(currentEventRequestResult.user_count)}
                    />
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
                </Box>
            );
        },
        true,
        <Box height="50px" width="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress color="inherit" />
        </Box>,
        (error: ApolloError) => (
            <Box width="100%" mr={1}>
                <GQLError error={error} />
            </Box>
        ),
        refreshAt,
    );
};

export { AppAnalyticsSummaryRealtime };
