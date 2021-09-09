import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';
import { DatamapsFields } from '../fragments/DatamapsFields';

const UpdateEventGetQuery = gql`
    query UpdateEventGetData($id: ID!, $triggerId: ID!) {
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
        getEvent(id: $id) {
            name
            event {
                __typename
                ... on CustomEvent {
                    custom_name
                }
                ... on PlatformEvent {
                    id
                    name
                    description
                    platform {
                        id
                        name
                    }
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
            clear_state_ms
            data_maps {
                ...datamapsFields
            }
        }
    }
    ${DatamapsFields}
    ${PlatformDatamapsFields}
`;

export default UpdateEventGetQuery;
