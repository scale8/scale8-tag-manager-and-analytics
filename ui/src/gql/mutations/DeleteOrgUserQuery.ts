import { gql } from '@apollo/client';

const DeleteOrgUserQuery = gql`
    mutation DeleteOrgUser($orgRemoveUserInput: OrgRemoveUserInput!) {
        removeUser(orgRemoveUserInput: $orgRemoveUserInput)
    }
`;

export default DeleteOrgUserQuery;
