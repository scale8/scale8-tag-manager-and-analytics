import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavPlatformQuery = gql`
    query NavPlatform($id: ID!) {
        getPlatform(id: $id) {
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
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavPlatformQuery;
