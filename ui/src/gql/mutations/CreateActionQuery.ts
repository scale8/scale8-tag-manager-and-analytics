import { gql } from '@apollo/client';

const CreateActionQuery = gql`
    mutation CreateActionResult($actionCreateInput: ActionCreateInput!) {
        createAction(actionCreateInput: $actionCreateInput) {
            id
        }
    }
`;

export default CreateActionQuery;
