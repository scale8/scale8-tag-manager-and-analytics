import { gql } from '@apollo/client';

const PageTemplatedActionQuery = gql`
    query TemplatedActionPageData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            locked
            platform_actions {
                id
                name
                description
                platform_data_maps {
                    id
                }
            }
        }
    }
`;

export default PageTemplatedActionQuery;
