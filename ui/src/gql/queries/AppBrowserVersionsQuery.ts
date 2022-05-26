import { gql } from '@apollo/client';

const AppBrowserVersionsQuery = gql`
    query AppBrowserVersionsQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            browser_version_stats(query_options: $appQueryOptions) {
                result {
                    key {
                        field
                        value
                    }
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppBrowserVersionsQuery;
