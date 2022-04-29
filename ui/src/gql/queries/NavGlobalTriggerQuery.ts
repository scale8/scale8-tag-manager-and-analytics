import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavGlobalTriggerQuery = gql`
    query NavGlobalTrigger($id: ID!) {
        getTrigger(id: $id) {
            id
            name
            revision {
                id
                name
                locked
                global_triggers {
                    id
                    name
                }
                app {
                    id
                    name
                    analytics_enabled
                    error_tracking_enabled
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
                        enabled
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

export default NavGlobalTriggerQuery;
