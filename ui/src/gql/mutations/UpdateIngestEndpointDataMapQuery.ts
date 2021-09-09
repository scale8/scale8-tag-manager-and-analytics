import { gql } from '@apollo/client';

const UpdateIngestEndpointDataMapQuery = gql`
    mutation UpdateIngestEndpointDataMap(
        $ingestEndpointDataMapUpdateInput: IngestEndpointDataMapUpdateInput
    ) {
        updateIngestEndpointDataMap(
            ingestEndpointDataMapUpdateInput: $ingestEndpointDataMapUpdateInput
        )
    }
`;

export default UpdateIngestEndpointDataMapQuery;
