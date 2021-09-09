import { gql } from '@apollo/client';

const AppSummaryRealtimeQuery = gql`
    query AppSummaryRealtimeQueryData(
        $id: ID!
        $appQueryOptions: AppQueryOptions!
        $appQueryOptionsPrev: AppQueryOptions!
        $appQueryOptionsCurrent: AppQueryOptions!
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
            current_request_stats: event_request_stats(query_options: $appQueryOptionsCurrent) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppSummaryRealtimeQuery;
