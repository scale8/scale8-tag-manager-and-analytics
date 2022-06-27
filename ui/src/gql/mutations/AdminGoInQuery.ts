import { gql } from '@apollo/client';

const AdminGoInQuery = gql`
    mutation AdminGoIn($adminAddMeToOrgInput: AdminAddMeToOrgInput!) {
        adminAddMeToOrg(adminAddMeToOrgInput: $adminAddMeToOrgInput)
    }
`;

export default AdminGoInQuery;
