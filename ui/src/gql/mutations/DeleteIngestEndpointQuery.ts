import { gql } from '@apollo/client';

const DeleteIngestEndpointQuery = gql`
    mutation DeleteIngestEndpoint($ingestEndpointDeleteInput: IngestEndpointDeleteInput!) {
        deleteIngestEndpoint(ingestEndpointDeleteInput: $ingestEndpointDeleteInput)
    }
`;

export default DeleteIngestEndpointQuery;
