import { gql } from '@apollo/client';

const AppDevicesQuery = gql`
    query AppDevicesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            device_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppDevicesQuery;
