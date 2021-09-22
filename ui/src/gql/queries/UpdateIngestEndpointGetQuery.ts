import { gql } from '@apollo/client';

const UpdateIngestEndpointGetQuery = gql`
    query UpdateIngestEndpointGetData($id: ID!) {
        getIngestEndpoint(id: $id) {
            id
            name
            analytics_enabled
            storage_provider
        }
    }
`;

export default UpdateIngestEndpointGetQuery;
