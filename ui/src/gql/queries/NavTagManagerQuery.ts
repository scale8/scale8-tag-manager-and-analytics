import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavTagManagerQuery = gql`
    query NavTagManager($id: ID!) {
        getTagManagerAccount(id: $id) {
            id
            org {
                ...orgUserDetails
            }
            enabled
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavTagManagerQuery;
