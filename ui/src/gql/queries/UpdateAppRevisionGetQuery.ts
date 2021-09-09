import { gql } from '@apollo/client';

const UpdateAppRevisionGetQuery = gql`
    query UpdateAppRevisionGetData($id: ID!) {
        getRevision(id: $id) {
            id
            name
        }
    }
`;

export default UpdateAppRevisionGetQuery;
