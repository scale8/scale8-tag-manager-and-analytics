import { gql } from '@apollo/client';

const AppPagesQuery = gql`
    query AppPagesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            page_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppPagesQuery;
