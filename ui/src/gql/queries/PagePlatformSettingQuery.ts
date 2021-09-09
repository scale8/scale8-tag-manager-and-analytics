import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const PagePlatformSettingQuery = gql`
    query PlatformSettingPageData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            platform_settings {
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

export default PagePlatformSettingQuery;
