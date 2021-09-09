import { gql } from '@apollo/client';

export const DatamapsFields = gql`
    fragment datamapsFields on DataMap {
        id
        key
        var_type
        value {
            __typename
            ... on DataMapValueContainer {
                value
            }
            ... on DataMapValueContainerArray {
                values
            }
            ... on DataMapObject {
                object {
                    ...datamapsFieldsLvl1
                }
            }
            ... on DataMapObjects {
                objects {
                    ...datamapsFieldsLvl1
                }
            }
        }
    }

    fragment datamapsFieldsLvl1 on DataMap {
        id
        key
        var_type
        value {
            __typename
            ... on DataMapValueContainer {
                value
            }
            ... on DataMapValueContainerArray {
                values
            }
            ... on DataMapObject {
                object {
                    ...datamapsFieldsLvl2
                }
            }
            ... on DataMapObjects {
                objects {
                    ...datamapsFieldsLvl2
                }
            }
        }
    }

    fragment datamapsFieldsLvl2 on DataMap {
        id
        key
        var_type
        value {
            __typename
            ... on DataMapValueContainer {
                value
            }
            ... on DataMapValueContainerArray {
                values
            }
        }
    }
`;
