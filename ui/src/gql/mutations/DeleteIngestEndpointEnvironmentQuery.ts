import { gql } from '@apollo/client';

const DeleteIngestEndpointEnvironmentQuery = gql`
    mutation DeleteIngestEndpointEnvironment(
        $ingestEndpointEnvironmentDeleteInput: IngestEndpointEnvironmentDeleteInput!
    ) {
        deleteIngestEndpointEnvironment(
            ingestEndpointEnvironmentDeleteInput: $ingestEndpointEnvironmentDeleteInput
        )
    }
`;

export default DeleteIngestEndpointEnvironmentQuery;
