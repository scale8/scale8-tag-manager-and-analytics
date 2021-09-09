import { gql } from '@apollo/client';

const AppReferrersQuery = gql`
    query AppReferrersQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            referrer_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
            referrer_tld_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppReferrersQuery;
