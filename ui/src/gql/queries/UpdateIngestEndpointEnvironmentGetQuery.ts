import { gql } from '@apollo/client';

const UpdateIngestEndpointEnvironmentGetQuery = gql`
    query UpdateIngestEndpointEnvironmentGetData($id: ID!, $ingestEndpointId: ID!) {
        getIngestEndpointEnvironment(id: $id) {
            id
            name
            custom_domain
            storage_provider
            ingest_endpoint_revision {
                id
            }
        }
        getIngestEndpoint(id: $ingestEndpointId) {
            id
            ingest_endpoint_revisions {
                id
                name
                locked
                created_at
                updated_at
            }
        }
    }
`;

export default UpdateIngestEndpointEnvironmentGetQuery;
