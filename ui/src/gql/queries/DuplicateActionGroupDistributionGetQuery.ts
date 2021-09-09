import { gql } from '@apollo/client';

const DuplicateActionGroupDistributionGetQuery = gql`
    query DuplicateActionGroupDistributionGetData($id: ID!) {
        getActionGroupDistribution(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateActionGroupDistributionGetQuery;
