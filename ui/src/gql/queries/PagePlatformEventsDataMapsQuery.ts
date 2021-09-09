import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const PagePlatformEventsDataMapsQuery = gql`
    query PlatformEventsDataMapsData($id: ID!) {
        getPlatformEvent(id: $id) {
            id
            platform_data_maps {
                ...platformDatamapsFields
                child_platform_data_maps {
                    ...platformDatamapsFields
                    child_platform_data_maps {
                        ...platformDatamapsFields
                    }
                }
            }
        }
    }
    ${PlatformDatamapsFields}
`;

export default PagePlatformEventsDataMapsQuery;
