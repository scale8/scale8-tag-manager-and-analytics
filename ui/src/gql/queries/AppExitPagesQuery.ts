import { gql } from '@apollo/client';

const AppExitPagesQuery = gql`
    query AppExitPagesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            exit_page_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppExitPagesQuery;
