import { gql } from '@apollo/client';

const AppInstructionsGetQuery = gql`
    query AppInstructionsGetData($id: ID!) {
        getApp(id: $id) {
            id
            environments {
                id
                name
                cname
                install_domain
                install_endpoint
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
    }
`;

export default AppInstructionsGetQuery;
