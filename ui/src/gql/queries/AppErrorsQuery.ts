import { gql } from '@apollo/client';

const AppErrorsQuery = gql`
    query AppErrorsQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            error_stats(query_options: $appQueryOptions) {
                result {
                    error_file
                    error_message
                    error_column
                    error_row
                    first_page_url
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppErrorsQuery;
