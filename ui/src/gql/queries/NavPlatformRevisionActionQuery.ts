import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavPlatformRevisionActionQuery = gql`
    query NavPlatformRevisionAction($id: ID!) {
        getPlatformAction(id: $id) {
            id
            name
            platform_revision {
                id
                name
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
                platform_actions {
                    id
                    name
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

export default NavPlatformRevisionActionQuery;
