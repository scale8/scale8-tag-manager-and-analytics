import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavGlobalActionQuery = gql`
    query NavGlobalAction($id: ID!) {
        getActionGroupDistribution(id: $id) {
            id
            name
            revision {
                id
                name
                locked
                global_action_group_distributions {
                    id
                    name
                }
                app {
                    id
                    name
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

export default NavGlobalActionQuery;
