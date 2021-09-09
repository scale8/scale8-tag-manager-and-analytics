import { gql } from '@apollo/client';

const DeleteEnvironmentVariableQuery = gql`
    mutation DeleteEnvironmentVariable(
        $environmentVariableDeleteInput: EnvironmentVariableDeleteInput!
    ) {
        deleteEnvironmentVariable(environmentVariableDeleteInput: $environmentVariableDeleteInput)
    }
`;

export default DeleteEnvironmentVariableQuery;
