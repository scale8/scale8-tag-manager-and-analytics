import { gql } from '@apollo/client';

const AppOperatingSystemsQuery = gql`
    query AppOperatingSystemsQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            operating_system_stats(query_options: $appQueryOptions) {
                result {
                    name
                    version
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppOperatingSystemsQuery;
