import { gql } from '@apollo/client';

const AppChartQuery = gql`
    query AppChartQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            event_request_stats(query_options: $appQueryOptions) {
                from
                to
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppChartQuery;
