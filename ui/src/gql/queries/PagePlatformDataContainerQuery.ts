import { gql } from '@apollo/client';

const PagePlatformDataContainerQuery = gql`
    query PlatformDataContainerPageData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            platform_data_containers {
                id
                name
                allow_custom
                description
                platform_data_maps {
                    id
                }
            }
        }
    }
`;

export default PagePlatformDataContainerQuery;
