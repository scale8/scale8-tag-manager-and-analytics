import { gql } from '@apollo/client';

const ReorderActionsQuery = gql`
    mutation ReorderAction($actionGroupOrderInput: ActionGroupOrderInput!) {
        updateActionsOrder(actionGroupOrderInput: $actionGroupOrderInput)
    }
`;

export default ReorderActionsQuery;
