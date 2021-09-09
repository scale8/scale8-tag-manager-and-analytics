import { gql } from '@apollo/client';

const AppUtmMediumQuery = gql`
    query AppUtmMediumQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            utm_medium_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppUtmMediumQuery;
