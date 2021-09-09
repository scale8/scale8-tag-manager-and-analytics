import { gql } from '@apollo/client';

const PageAppRevisionQuery = gql`
    query AppRevisionPageData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            revisions {
                id
                name
                tags {
                    id
                }
                app_platform_revisions {
                    id
                    platform_revision {
                        id
                    }
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
                locked
                created_at
                updated_at
            }
        }
    }
`;

export default PageAppRevisionQuery;
