import { gql } from '@apollo/client';

const PageAppPlatformRevisionQuery = gql`
    query AppPlatformRevisionPageData($id: ID!) {
        getRevision(id: $id) {
            id
            locked
            app_platform_revisions {
                id
                created_at
                updated_at
                platform_revision {
                    id
                    name
                    platform {
                        id
                        name
                    }
                    locked
                }
            }
        }
    }
`;
export default PageAppPlatformRevisionQuery;
