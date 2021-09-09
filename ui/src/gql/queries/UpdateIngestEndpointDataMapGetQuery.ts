import { gql } from '@apollo/client';

const UpdateIngestEndpointDataMapGetQuery = gql`
    query UpdateIngestEndpointDataMapGetData($id: ID!) {
        getIngestEndpointDataMap(id: $id) {
            id
            key
            var_type
            default_value {
                __typename
                ... on DefaultValueContainer {
                    value
                }
                ... on DefaultValueContainerArray {
                    values
                }
            }
            is_optional
            validation_rules {
                type
                input_value
            }
        }
    }
`;

export default UpdateIngestEndpointDataMapGetQuery;
