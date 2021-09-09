import { gql } from '@apollo/client';

const TypeImportingQuery = gql`
    query getImportedTypes {
        extra_types {
            notification_type
            dm_macros_string
            dm_macros_integer
            dm_macros_date
            dm_macros_ts
        }
    }
`;

// noinspection JSUnusedGlobalSymbols
export default TypeImportingQuery;
