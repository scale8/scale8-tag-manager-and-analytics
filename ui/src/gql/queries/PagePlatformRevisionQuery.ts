import { gql } from '@apollo/client';

const PagePlatformRevisionQuery = gql`
    query PlatformRevisionPageData($id: ID!) {
        getPlatform(id: $id) {
            id
            platform_revisions {
                id
                name
                locked
                is_published
                created_at
                updated_at
            }
        }
    }
`;

export default PagePlatformRevisionQuery;
