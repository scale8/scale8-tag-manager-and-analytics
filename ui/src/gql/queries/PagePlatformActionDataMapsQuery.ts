import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const PagePlatformActionDataMapsQuery = gql`
    query PagePlatformActionDataMapsData($id: ID!) {
        getPlatformAction(id: $id) {
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

export default PagePlatformActionDataMapsQuery;
