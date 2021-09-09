import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const FetchAvailableDataContainersQuery = gql`
    query FetchAvailableDataContainers($triggerId: ID!) {
        getTrigger(id: $triggerId) {
            id
            revision {
                id
                app_platform_revisions {
                    id
                    platform_revision {
                        id
                        platform {
                            id
                            name
                        }
                        platform_data_containers {
                            id
                            persisting_id
                            allow_custom
                            name
                            icon
                            description
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
                }
            }
        }
    }
    ${PlatformDatamapsFields}
`;

export default FetchAvailableDataContainersQuery;
