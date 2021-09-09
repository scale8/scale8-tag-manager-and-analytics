import { gql } from '@apollo/client';

const DeleteActionQuery = gql`
    mutation DeleteAction($actionDeleteInput: ActionDeleteInput!) {
        deleteAction(actionDeleteInput: $actionDeleteInput) {
            id
        }
    }
`;

export default DeleteActionQuery;
