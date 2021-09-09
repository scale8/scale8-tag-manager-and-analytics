import { gql } from '@apollo/client';

const DeployAppRevisionGetQuery = gql`
    query DeployAppRevisionGetData($id: ID!) {
        getRevision(id: $id) {
            id
            app {
                id
                environments {
                    id
                    name
                    revision {
                        id
                    }
                }
            }
        }
    }
`;

export default DeployAppRevisionGetQuery;
