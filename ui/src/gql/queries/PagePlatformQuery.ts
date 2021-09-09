import { gql } from '@apollo/client';

const PagePlatformQuery = gql`
    query PlatformPageData($id: ID!) {
        getTagManagerAccount(id: $id) {
            id
            platforms {
                id
                name
                platform_revisions {
                    id
                }
                is_public
                type
                created_at
                updated_at
            }
        }
    }
`;

export default PagePlatformQuery;
