import { gql } from '@apollo/client';

const PreviewRevisionGetQuery = gql`
    query PreviewRevisionGetData($id: ID!) {
        getRevision(id: $id) {
            id
            name
            app {
                environments {
                    id
                    name
                    url
                }
            }
        }
    }
`;

export default PreviewRevisionGetQuery;
