import { gql } from '@apollo/client';

const UpdateActionGroupQuery = gql`
    mutation UpdateActionGroup($actionGroupUpdateInput: ActionGroupUpdateInput!) {
        updateActionGroup(actionGroupUpdateInput: $actionGroupUpdateInput)
    }
`;

export default UpdateActionGroupQuery;
