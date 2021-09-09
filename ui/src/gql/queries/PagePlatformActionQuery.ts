import { gql } from '@apollo/client';

const PagePlatformActionQuery = gql`
    query PlatformActionPageData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            platform_actions {
                id
                name
                description
                s2s_endpoint
                platform_data_maps {
                    id
                }
            }
        }
    }
`;

export default PagePlatformActionQuery;
