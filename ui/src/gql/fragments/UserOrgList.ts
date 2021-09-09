import { gql } from '@apollo/client';

export const UserOrgList = gql`
    fragment userOrgList on User {
        id
        orgs {
            id
            name
        }
    }
`;
