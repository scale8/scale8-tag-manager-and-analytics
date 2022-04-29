import { gql } from '@apollo/client';

const PageSelectOrgQuery = gql`
    query PageSelectOrgData {
        me {
            id
            invites {
                id
            }
            orgs {
                id
                name
                tag_manager_account {
                    id
                    apps {
                        id
                    }
                    enabled
                }
                data_manager_account {
                    id
                    enabled
                }
            }
        }
    }
`;

export default PageSelectOrgQuery;
