import { gql } from '@apollo/client';

const OrgsAdminQuery = gql`
    query OrgsAdminPageData {
        me {
            id
            is_admin
            orgs {
                id
            }
        }
        getOrgs {
            id
            name
            updated_at
            created_at
        }
    }
`;

export default OrgsAdminQuery;
