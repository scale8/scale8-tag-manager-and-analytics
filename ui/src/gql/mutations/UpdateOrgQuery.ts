import { gql } from '@apollo/client';

const UpdateOrgQuery = gql`
    mutation UpdateOrg($orgUpdateInput: OrgUpdateInput!) {
        updateOrg(orgUpdateInput: $orgUpdateInput)
    }
`;

export default UpdateOrgQuery;
