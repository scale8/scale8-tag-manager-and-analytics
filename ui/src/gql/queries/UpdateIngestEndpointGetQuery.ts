import { gql } from '@apollo/client';

const UpdateIngestEndpointGetQuery = gql`
    query UpdateIngestEndpointGetData($id: ID!) {
        getIngestEndpoint(id: $id) {
            id
            name
        }
    }
`;

export default UpdateIngestEndpointGetQuery;
