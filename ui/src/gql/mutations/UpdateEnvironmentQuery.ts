import { gql } from '@apollo/client';

const UpdateEnvironmentQuery = gql`
    mutation UpdateEnvironment($environmentUpdateInput: EnvironmentUpdateInput!) {
        updateEnvironment(environmentUpdateInput: $environmentUpdateInput)
    }
`;

export default UpdateEnvironmentQuery;
