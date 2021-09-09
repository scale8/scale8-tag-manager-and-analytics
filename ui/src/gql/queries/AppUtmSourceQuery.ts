import { gql } from '@apollo/client';

const AppUtmSourceQuery = gql`
    query AppUtmSourceQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            utm_source_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppUtmSourceQuery;
