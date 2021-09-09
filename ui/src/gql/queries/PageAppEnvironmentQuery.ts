import { gql } from '@apollo/client';

const PageAppEnvironmentQuery = gql`
    query AppEnvironmentPageData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            environments {
                id
                name
                url
                custom_domain
                install_domain
                revision {
                    id
                    name
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

export default PageAppEnvironmentQuery;
