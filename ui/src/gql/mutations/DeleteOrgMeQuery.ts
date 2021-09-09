import { gql } from '@apollo/client';

const DeleteOrgMeQuery = gql`
    mutation DeleteOrgMe($orgRemoveMeInput: OrgRemoveMeInput!) {
        removeMe(orgRemoveMeInput: $orgRemoveMeInput)
    }
`;

export default DeleteOrgMeQuery;
