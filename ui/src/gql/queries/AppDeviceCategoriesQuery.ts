import { gql } from '@apollo/client';

const AppDeviceCategoriesQuery = gql`
    query AppDeviceCategoriesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            device_category_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppDeviceCategoriesQuery;
