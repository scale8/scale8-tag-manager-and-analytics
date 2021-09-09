import { gql } from '@apollo/client';

const PageOrgUserQuery = gql`
    query OrgUserPageData($id: ID!) {
        getOrg(id: $id) {
            id
            users {
                id
                first_name
                last_name
                email
                two_factor_auth
                permissions {
                    can_view
                    can_create
                    can_edit
                    can_delete
                    is_admin
                }
                owner
                created_at
                updated_at
            }
        }
    }
`;

export default PageOrgUserQuery;
