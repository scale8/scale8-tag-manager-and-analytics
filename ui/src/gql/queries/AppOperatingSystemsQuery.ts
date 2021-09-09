import { gql } from '@apollo/client';

const AppOperatingSystemsQuery = gql`
    query AppOperatingSystemsQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            operating_system_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppOperatingSystemsQuery;
