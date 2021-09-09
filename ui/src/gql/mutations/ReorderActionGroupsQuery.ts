import { gql } from '@apollo/client';

const ReorderActionGroupsQuery = gql`
    mutation ReorderActionGroup(
        $actionGroupDistributionOrderInput: ActionGroupDistributionOrderInput!
    ) {
        updateActionGroupsOrder(
            actionGroupDistributionOrderInput: $actionGroupDistributionOrderInput
        )
    }
`;

export default ReorderActionGroupsQuery;
