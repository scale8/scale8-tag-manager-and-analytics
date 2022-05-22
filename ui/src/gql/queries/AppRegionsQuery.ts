import { gql } from '@apollo/client';

const AppRegionsQuery = gql`
    query AppRegionsQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            region_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppRegionsQuery;
