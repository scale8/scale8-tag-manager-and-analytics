import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavPlatformRevisionQuery = gql`
    query NavPlatformRevision($id: ID!) {
        getPlatformRevision(id: $id) {
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
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavPlatformRevisionQuery;
