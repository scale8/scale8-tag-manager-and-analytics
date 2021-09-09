import { gql } from '@apollo/client';

const DeleteAppQuery = gql`
    mutation DeleteApp($appDeleteInput: AppDeleteInput!) {
        deleteApp(appDeleteInput: $appDeleteInput)
    }
`;

export default DeleteAppQuery;
