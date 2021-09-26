import { gql } from '@apollo/client';

const AppErrorsSummaryQuery = gql`
    query AppErrorsSummaryQueryData(
        $id: ID!
        $appQueryOptions: AppQueryOptions!
        $appQueryOptionsPrev: AppQueryOptions!
    ) {
        getApp(id: $id) {
            id
            name
            error_stats(query_options: $appQueryOptions) {
                result {
                    user_count
                    event_count
                }
            }
            prev_error_stats: error_stats(query_options: $appQueryOptionsPrev) {
                result {
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppErrorsSummaryQuery;
