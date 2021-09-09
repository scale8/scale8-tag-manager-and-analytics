import { gql } from '@apollo/client';

const CreateGlobalActionQuery = gql`
    mutation CreateGlobalActionResult(
        $actionGroupDistributionCreateInput: ActionGroupDistributionCreateInput!
    ) {
        createActionGroupDistribution(
            actionGroupDistributionCreateInput: $actionGroupDistributionCreateInput
        ) {
            id
        }
    }
`;

export default CreateGlobalActionQuery;
