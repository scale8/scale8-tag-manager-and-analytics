import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavDataManagerQuery = gql`
    query NavDataManager($id: ID!) {
        getDataManagerAccount(id: $id) {
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

export default NavDataManagerQuery;
