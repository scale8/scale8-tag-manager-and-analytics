import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavPlatformRevisionEventQuery = gql`
    query NavPlatformRevisionEvent($id: ID!) {
        getPlatformEvent(id: $id) {
            id
            name
            platform_revision {
                id
                name
                platform_events {
                    id
                    name
                }
                platform {
                    id
                    name
                    tag_manager_account {
                        id
                        platforms {
                            id
                            name
                            type
                        }
                        org {
                            ...orgUserDetails
                        }
                    }
                    platform_revisions {
                        id
                        name
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

export default NavPlatformRevisionEventQuery;
