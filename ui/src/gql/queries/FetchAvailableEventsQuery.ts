import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';

const FetchAvailableEventsQuery = gql`
    query FetchAvailableEvents($triggerId: ID!) {
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
                        platform_events {
                            id
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

export default FetchAvailableEventsQuery;
