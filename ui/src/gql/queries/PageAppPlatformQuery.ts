import { gql } from '@apollo/client';

const PageAppPlatformQuery = gql`
    query AppPlatformPageData($id: ID!) {
        getApp(id: $id) {
            id
            app_platforms {
                platform {
                    id
                    name
                    created_at
                    updated_at
                }
            }
        }
    }
`;

export default PageAppPlatformQuery;
