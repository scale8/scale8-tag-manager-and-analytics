import { gql } from '@apollo/client';

const AppScreenSizesQuery = gql`
    query AppScreenSizesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            screen_size_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppScreenSizesQuery;
