import { gql } from '@apollo/client';

const UpdateIngestEndpointEnvironmentQuery = gql`
    mutation UpdateIngestEndpointEnvironmentResult(
        $ingestEndpointEnvironmentUpdateInput: IngestEndpointEnvironmentUpdateInput!
    ) {
        updateIngestEndpointEnvironment(
            ingestEndpointEnvironmentUpdateInput: $ingestEndpointEnvironmentUpdateInput
        )
    }
`;

export default UpdateIngestEndpointEnvironmentQuery;
