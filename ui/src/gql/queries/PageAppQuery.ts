import { gql } from '@apollo/client';

const PageAppQuery = gql`
    query AppPageData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getTagManagerAccount(id: $id) {
            id
            apps {
                id
                name
                type
                domain
                revisions {
                    id
                }
                event_request_stats(query_options: $appQueryOptions) {
                    from
                    to
                    result {
                        key
                        user_count
                        event_count
                    }
                }
                created_at
                updated_at
            }
        }
    }
`;

export default PageAppQuery;
