import { gql } from '@apollo/client';

const UpdateEnvironmentGetQuery = gql`
    query UpdateEnvironmentGetData($id: ID!, $appId: ID!) {
        getEnvironment(id: $id) {
            id
            name
            url
            custom_domain
            revision {
                id
            }
        }
        getApp(id: $appId) {
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

export default UpdateEnvironmentGetQuery;
