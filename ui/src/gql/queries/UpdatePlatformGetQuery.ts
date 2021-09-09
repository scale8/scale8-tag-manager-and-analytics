import { gql } from '@apollo/client';

const UpdatePlatformGetQuery = gql`
    query UpdatePlatformGetData($id: ID!) {
        getPlatform(id: $id) {
            id
            name
            description
        }
    }
`;

export default UpdatePlatformGetQuery;
