import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const FetchAvailableAppPlatformRevisionsQuery = gql`
    query FetchAvailableAppPlatformRevisions($id: ID!) {
        getRevision(id: $id) {
            id
            app_platform_revisions {
                id
                platform_revision {
                    id
                    name
                    platform {
                        id
                        name
                    }
                }
            }
            app {
                app_platforms {
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
    }
    ${PlatformDatamapsFields}
`;

export default FetchAvailableAppPlatformRevisionsQuery;
