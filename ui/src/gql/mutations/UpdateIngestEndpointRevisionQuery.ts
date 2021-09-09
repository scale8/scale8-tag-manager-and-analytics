import { gql } from '@apollo/client';

const UpdateIngestEndpointRevisionQuery = gql`
    mutation UpdateIngestEndpointRevisionResult(
        $ingestEndpointRevisionUpdateInput: IngestEndpointRevisionUpdateInput!
    ) {
        updateIngestEndpointRevision(
            ingestEndpointRevisionUpdateInput: $ingestEndpointRevisionUpdateInput
        )
    }
`;

export default UpdateIngestEndpointRevisionQuery;
