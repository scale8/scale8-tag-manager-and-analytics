import { gql } from '@apollo/client';

const PageOrgQuery = gql`
    query OrgPageData {
        me {
            id
            orgs {
                id
                name
                tag_manager_account {
                    id
                }
                data_manager_account {
                    id
                }
                users {
                    id
                }
                created_at
                updated_at
            }
        }
    }
`;

export default PageOrgQuery;
