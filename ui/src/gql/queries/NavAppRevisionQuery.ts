import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavAppRevisionQuery = gql`
    query NavAppRevision($id: ID!) {
        getRevision(id: $id) {
            id
            name
            locked
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
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavAppRevisionQuery;
