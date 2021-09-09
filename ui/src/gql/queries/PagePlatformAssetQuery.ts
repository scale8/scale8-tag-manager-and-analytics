import { gql } from '@apollo/client';

const PagePlatformAssetQuery = gql`
    query PlatformAssetPageData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            platform_assets {
                id
                name
                mime_type
                size
            }
        }
    }
`;

export default PagePlatformAssetQuery;
