import { gql } from '@apollo/client';

const FetchIngestEndpointRevisionsQuery = gql`
    query IngestEndpointRevisionsData($id: ID!) {
        getIngestEndpoint(id: $id) {
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

export default FetchIngestEndpointRevisionsQuery;
