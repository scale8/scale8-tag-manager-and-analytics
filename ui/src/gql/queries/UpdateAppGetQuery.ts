import { gql } from '@apollo/client';

const UpdateAppGetQuery = gql`
    query UpdateAppGetData($id: ID!) {
        getApp(id: $id) {
            id
            name
            domain
            type
        }
    }
`;

export default UpdateAppGetQuery;
