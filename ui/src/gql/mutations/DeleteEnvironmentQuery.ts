import { gql } from '@apollo/client';

const DeleteEnvironmentQuery = gql`
    mutation DeleteEnvironment($environmentDeleteInput: EnvironmentDeleteInput!) {
        deleteEnvironment(environmentDeleteInput: $environmentDeleteInput)
    }
`;

export default DeleteEnvironmentQuery;
