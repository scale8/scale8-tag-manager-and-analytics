import { gql } from '@apollo/client';

const UpdateActionQuery = gql`
    mutation UpdateActionResult($actionUpdateInput: ActionUpdateInput!) {
        updateAction(actionUpdateInput: $actionUpdateInput)
    }
`;

export default UpdateActionQuery;
