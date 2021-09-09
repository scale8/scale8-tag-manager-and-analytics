import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavOrgQuery = gql`
    query NavOrg($id: ID!) {
        getOrg(id: $id) {
            ...orgUserDetails
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavOrgQuery;
