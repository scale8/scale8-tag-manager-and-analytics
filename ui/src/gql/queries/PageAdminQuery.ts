import { gql } from '@apollo/client';

const PageAdminQuery = gql`
    query AdminPageData {
        me {
            id
            is_admin
        }
    }
`;

export default PageAdminQuery;
