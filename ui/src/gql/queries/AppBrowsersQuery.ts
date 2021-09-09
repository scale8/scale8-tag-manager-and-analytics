import { gql } from '@apollo/client';

const AppBrowsersQuery = gql`
    query AppBrowsersQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            browser_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppBrowsersQuery;
