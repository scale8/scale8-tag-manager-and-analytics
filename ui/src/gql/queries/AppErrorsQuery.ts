import { gql } from '@apollo/client';

const AppErrorsQuery = gql`
    query AppErrorsQueryData(
        $id: ID!
        $appQueryOptions: AppQueryOptions!
        $appSummaryQueryOptions: AppQueryOptions!
    ) {
        getApp(id: $id) {
            id
            name
            event_request_stats(query_options: $appSummaryQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
            error_stats(query_options: $appQueryOptions) {
                result {
                    error_id
                    error_file
                    error_message
                    error_column
                    error_row
                    user_count
                    event_count
                    error_trace
                }
            }
        }
    }
`;

export default AppErrorsQuery;
