import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavTagQuery = gql`
    query NavTag($id: ID!) {
        getTag(id: $id) {
            id
            name
            revision {
                id
                name
                locked
                tags {
                    id
                    name
                }
                app {
                    id
                    name
                    analytics_enabled
                    storage_provider
                    revisions {
                        id
                        name
                    }
                    tag_manager_account {
                        id
                        apps {
                            id
                            name
                        }
                        org {
                            ...orgUserDetails
                        }
                    }
                }
            }
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavTagQuery;
