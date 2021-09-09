import { gql } from '@apollo/client';

const DeleteActionGroupQuery = gql`
    mutation DeleteActionGroup($actionGroupDeleteInput: ActionGroupDeleteInput!) {
        deleteActionGroup(actionGroupDeleteInput: $actionGroupDeleteInput) {
            id
            model
            name
        }
    }
`;

export default DeleteActionGroupQuery;
