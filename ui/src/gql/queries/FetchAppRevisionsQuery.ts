import { gql } from '@apollo/client';

const FetchAppRevisionsQuery = gql`
    query AppRevisionsData($id: ID!) {
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
                locked
                created_at
                updated_at
            }
        }
    }
`;

export default FetchAppRevisionsQuery;
