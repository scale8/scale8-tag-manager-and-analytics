import { gql } from '@apollo/client';

const PagePlatformEventQuery = gql`
    query PlatformEventPageData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            platform_events {
                id
                name
                description
                event
                platform_data_maps {
                    id
                }
            }
        }
    }
`;

export default PagePlatformEventQuery;
