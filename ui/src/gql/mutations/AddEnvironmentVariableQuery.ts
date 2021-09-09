import { gql } from '@apollo/client';

const AddEnvironmentVariableQuery = gql`
    mutation AddEnvironmentVariable($environmentVariableAddInput: EnvironmentVariableAddInput!) {
        addEnvironmentVariable(environmentVariableAddInput: $environmentVariableAddInput)
    }
`;

export default AddEnvironmentVariableQuery;
