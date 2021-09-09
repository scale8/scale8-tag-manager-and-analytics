import { gql } from '@apollo/client';

const AppSummaryQuery = gql`
    query AppSummaryQueryData(
        $id: ID!
        $appQueryOptions: AppQueryOptions!
        $appQueryOptionsPrev: AppQueryOptions!
    ) {
        getApp(id: $id) {
            id
            name
            event_request_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
            prev_request_stats: event_request_stats(query_options: $appQueryOptionsPrev) {
                result {
                    key
                    user_count
                    event_count
                }
            }
            average_session_duration_stats(query_options: $appQueryOptions) {
                result
            }
            prev_average_session_duration: average_session_duration_stats(
                query_options: $appQueryOptionsPrev
            ) {
                result
            }
            bounce_ratio_stats(query_options: $appQueryOptions) {
                result
            }
            prev_bounce_ratio: bounce_ratio_stats(query_options: $appQueryOptionsPrev) {
                result
            }
        }
    }
`;

export default AppSummaryQuery;
