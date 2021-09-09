import { gql } from '@apollo/client';

const UpdateIngestEndpointQuery = gql`
    mutation UpdateIngestEndpointResult($ingestEndpointUpdateInput: IngestEndpointUpdateInput!) {
        updateIngestEndpoint(ingestEndpointUpdateInput: $ingestEndpointUpdateInput)
    }
`;

export default UpdateIngestEndpointQuery;
