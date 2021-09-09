import { gql } from '@apollo/client';

const CreateIngestEndpointQuery = gql`
    mutation CreateIngestEndpointResult($ingestEndpointCreateInput: IngestEndpointCreateInput!) {
        createIngestEndpoint(ingestEndpointCreateInput: $ingestEndpointCreateInput) {
            id
        }
    }
`;

export default CreateIngestEndpointQuery;
