import { gql } from '@apollo/client';

const PageUserInviteQuery = gql`
    query UserInvitePageData($id: ID!) {
        getOrg(id: $id) {
            id
            invites {
                id
                email
                org_permissions {
                    can_view
                    can_create
                    can_edit
                    can_delete
                    is_admin
                }
                created_at
                updated_at
            }
        }
    }
`;

export default PageUserInviteQuery;
