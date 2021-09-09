import { gql } from '@apollo/client';

const CreateOrgQuery = gql`
    mutation CreateOrg($orgCreateInput: OrgCreateInput!) {
        createOrg(orgCreateInput: $orgCreateInput) {
            id
        }
    }
`;

export default CreateOrgQuery;
