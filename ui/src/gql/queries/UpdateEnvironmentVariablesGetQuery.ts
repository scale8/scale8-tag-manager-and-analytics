import { gql } from '@apollo/client';

const UpdateEnvironmentVariablesGetQuery = gql`
    query UpdateEnvironmentVariablesGetData($id: ID!) {
        getEnvironment(id: $id) {
            id
            name
            environment_variables {
                key
                value
            }
        }
    }
`;

export default UpdateEnvironmentVariablesGetQuery;
