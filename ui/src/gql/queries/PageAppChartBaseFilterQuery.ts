import { gql } from '@apollo/client';

const PageAppChartBaseFilterQuery = gql`
    query AppChartBaseData($id: ID!) {
        getApp(id: $id) {
            id
            revisions {
                id
                name
            }
            environments {
                id
                name
            }
        }
    }
`;

export default PageAppChartBaseFilterQuery;
