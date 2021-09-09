import { gql } from '@apollo/client';

const DeleteOrgQuery = gql`
    mutation DeleteOrg($orgDeleteInput: OrgDeleteInput!) {
        deleteOrg(orgDeleteInput: $orgDeleteInput)
    }
`;

export default DeleteOrgQuery;
