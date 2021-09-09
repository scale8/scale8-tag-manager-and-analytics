import { gql } from '@apollo/client';

const UpdateOrgUserGetQuery = gql`
    query UpdateOrgUserGetData($orgId: ID!, $userId: ID!) {
        getOrgUserPermissions(orgId: $orgId, userId: $userId) {
            can_view
            can_create
            can_edit
            can_delete
            is_admin
        }
    }
`;

export default UpdateOrgUserGetQuery;
