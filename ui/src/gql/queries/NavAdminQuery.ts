import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';

const NavAdminQuery = gql`
    query NavAdmin {
        me {
            ...userOrgList
        }
    }
    ${UserOrgList}
`;

export default NavAdminQuery;
