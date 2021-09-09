import { gql } from '@apollo/client';

const OrgTransferOwnershipGetQuery = gql`
    query OrgTransferOwnershipGetData($id: ID!) {
        getOrg(id: $id) {
            id
            users {
                id
                first_name
                last_name
                email
                permissions {
                    can_view
                    can_create
                    can_edit
                    can_delete
                    is_admin
                }
                owner
            }
        }
    }
`;

export default OrgTransferOwnershipGetQuery;
