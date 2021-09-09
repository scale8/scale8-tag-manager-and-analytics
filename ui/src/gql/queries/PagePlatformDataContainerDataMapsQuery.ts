import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const PagePlatformDataContainerDataMapsQuery = gql`
    query PlatformDataContainerDataMapsData($id: ID!) {
        getPlatformDataContainer(id: $id) {
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

export default PagePlatformDataContainerDataMapsQuery;
