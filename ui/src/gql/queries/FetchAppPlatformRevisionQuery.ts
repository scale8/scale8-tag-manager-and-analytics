import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';
import { DatamapsFields } from '../fragments/DatamapsFields';

const FetchAppPlatformRevisionQuery = gql`
    query FetchAppPlatformRevisionData($id: ID!) {
        getAppPlatformRevision(id: $id) {
            id
            platform_settings {
                ...datamapsFields
            }
            platform_revision {
                id
                platform {
                    id
                    name
                    platform_revisions {
                        id
                        name
                        locked
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
            }
        }
    }
    ${DatamapsFields}
    ${PlatformDatamapsFields}
`;

export default FetchAppPlatformRevisionQuery;
