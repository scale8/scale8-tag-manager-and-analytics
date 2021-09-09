import { gql } from '@apollo/client';

const UpdateActionGroupDistributionQuery = gql`
    mutation UpdateActionGroupDistribution(
        $actionGroupDistributionUpdateInput: ActionGroupDistributionUpdateInput!
    ) {
        updateActionGroupDistribution(
            actionGroupDistributionUpdateInput: $actionGroupDistributionUpdateInput
        )
    }
`;

export default UpdateActionGroupDistributionQuery;
