import { gql } from '@apollo/client';

const AppEntryPagesQuery = gql`
    query AppEntryPagesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            entry_page_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppEntryPagesQuery;
