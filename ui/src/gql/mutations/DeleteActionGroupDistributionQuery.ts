import { gql } from '@apollo/client';

const DeleteActionGroupDistributionQuery = gql`
    mutation DeleteActionGroupDistribution(
        $actionGroupDistributionDeleteInput: ActionGroupDistributionDeleteInput!
    ) {
        deleteActionGroupDistribution(
            actionGroupDistributionDeleteInput: $actionGroupDistributionDeleteInput
        ) {
            id
            model
            name
        }
    }
`;

export default DeleteActionGroupDistributionQuery;
