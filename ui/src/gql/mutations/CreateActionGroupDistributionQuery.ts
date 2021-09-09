import { gql } from '@apollo/client';

const CreateActionGroupDistributionQuery = gql`
    mutation CreateActionGroupDistribution(
        $actionGroupDistributionCreateInput: ActionGroupDistributionCreateInput!
    ) {
        createActionGroupDistribution(
            actionGroupDistributionCreateInput: $actionGroupDistributionCreateInput
        ) {
            id
            name
            action_group_distribution_type
        }
    }
`;

export default CreateActionGroupDistributionQuery;
