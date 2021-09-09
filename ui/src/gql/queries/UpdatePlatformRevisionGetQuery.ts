import { gql } from '@apollo/client';

const UpdatePlatformRevisionGetQuery = gql`
    query UpdatePlatformRevisionGetData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            name
        }
    }
`;

export default UpdatePlatformRevisionGetQuery;
