import { gql } from '@apollo/client';

const UpdateIngestEndpointRevisionGetQuery = gql`
    query UpdateIngestEndpointRevisionGetData($id: ID!) {
        getIngestEndpointRevision(id: $id) {
            id
            name
        }
    }
`;

export default UpdateIngestEndpointRevisionGetQuery;
