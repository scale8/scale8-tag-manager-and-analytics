import { gql } from '@apollo/client';

const CreateEnvironmentQuery = gql`
    mutation CreateEnvironment($environmentCreateInput: EnvironmentCreateInput!) {
        createEnvironment(environmentCreateInput: $environmentCreateInput) {
            id
        }
    }
`;

export default CreateEnvironmentQuery;
