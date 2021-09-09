import { gql } from '@apollo/client';
import { PlatformDatamapsFields } from '../fragments/PlatformDatamapsFields';
import { DatamapsFields } from '../fragments/DatamapsFields';

const InspectEventQuery = gql`
    query InspectEventData($id: ID!) {
        getEvent(id: $id) {
            name
            clear_state_ms
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
            data_maps {
                ...datamapsFields
            }
        }
    }
    ${DatamapsFields}
    ${PlatformDatamapsFields}
`;

export default InspectEventQuery;
