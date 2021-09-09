import { gql } from '@apollo/client';

const DuplicateActionGroupDistributionQuery = gql`
    mutation DuplicateActionGroupDistribution(
        $actionGroupDistributionDuplicateInput: ActionGroupDistributionDuplicateInput!
    ) {
        duplicateActionGroupDistribution(
            actionGroupDistributionDuplicateInput: $actionGroupDistributionDuplicateInput
        ) {
            id
        }
    }
`;

export default DuplicateActionGroupDistributionQuery;
