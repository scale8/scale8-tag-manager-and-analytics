import { gql } from '@apollo/client';

const UpdateTagGetQuery = gql`
    query UpdateTagGetData($id: ID!) {
        getTag(id: $id) {
            id
            name
            type
            width
            height
            auto_load
        }
    }
`;

export default UpdateTagGetQuery;
