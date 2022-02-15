import { gql } from '@apollo/client';

const EnvironmentInstructionsGetQuery = gql`
    query EnvironmentInstructionsGetData($id: ID!) {
        getEnvironment(id: $id) {
            id
            name
            cname
            install_domain
            custom_domain
            revision {
                id
                tags {
                    id
                    name
                    tag_code
                    type
                    auto_load
                }
            }
        }
    }
`;

export default EnvironmentInstructionsGetQuery;
