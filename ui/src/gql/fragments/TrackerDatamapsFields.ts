import { gql } from '@apollo/client';

export const TrackerDatamapsFields = gql`
    fragment trackerDatamapsFields on IngestEndpointDataMap {
        id
        key
        var_type
        is_optional
        default_value {
            __typename
            ... on DefaultValueContainer {
                value
            }
            ... on DefaultValueContainerArray {
                values
            }
        }
    }
`;
