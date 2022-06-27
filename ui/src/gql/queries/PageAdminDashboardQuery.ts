import { gql } from '@apollo/client';

const PageAdminDashboardQuery = gql`
    query PageAdminDashboardData {
        me {
            id
            is_admin
        }
        getOrgs {
            id
        }
    }
`;

export default PageAdminDashboardQuery;
