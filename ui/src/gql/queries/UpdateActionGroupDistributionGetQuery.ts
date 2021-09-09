import { gql } from '@apollo/client';

const UpdateActionGroupDistributionGetQuery = gql`
    query UpdateActionGroupDistributionGetData($id: ID!) {
        getActionGroupDistribution(id: $id) {
            id
            name
        }
    }
`;

export default UpdateActionGroupDistributionGetQuery;
