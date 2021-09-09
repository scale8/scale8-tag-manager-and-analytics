import { gql } from '@apollo/client';

export const PlatformDatamapsFields = gql`
    fragment platformDatamapsFields on PlatformDataMap {
        id
        key
        var_type
        input_type
        description
        icon
        option_values
        validation_rules {
            type
            input_value
        }
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
