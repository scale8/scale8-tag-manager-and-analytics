import { gql } from '@apollo/client';

const UpdateOrgUserQuery = gql`
    mutation UpdateOrgUser($orgUpdateUserInput: OrgUpdateUserInput!) {
        updateUserPermissions(orgUpdateUserInput: $orgUpdateUserInput)
    }
`;

export default UpdateOrgUserQuery;
