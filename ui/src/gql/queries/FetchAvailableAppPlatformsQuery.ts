import { gql } from '@apollo/client';

const FetchAvailableAppPlatformsQuery = gql`
    query FetchAvailableAppPlatforms($id: ID!) {
        getApp(id: $id) {
            id
            app_platforms {
                platform {
                    id
                    name
                }
            }
        }
        getPublicPlatforms {
            id
            name
        }
    }
`;

export default FetchAvailableAppPlatformsQuery;
