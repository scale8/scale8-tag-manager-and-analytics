import { gql } from '@apollo/client';

const AppAnalyticsContentQuery = gql`
    query AppAnalyticsContentQueryData($id: ID!) {
        getApp(id: $id) {
            id
            name
            event_request_stats(
                query_options: {
                    time_slice: YEAR
                    filter_options: { from: "-86400s", to: "0s", event: "page-view" }
                }
            ) {
                result {
                    key
                    user_count
                    event_count
                }
            }
            environments {
                id
                name
            }
        }
    }
`;

export default AppAnalyticsContentQuery;
