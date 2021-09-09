import { gql } from '@apollo/client';

const CreateIngestEndpointEnvironmentQuery = gql`
    mutation CreateIngestEndpointEnvironmentResult(
        $ingestEndpointEnvironmentCreateInput: IngestEndpointEnvironmentCreateInput!
    ) {
        createIngestEndpointEnvironment(
            ingestEndpointEnvironmentCreateInput: $ingestEndpointEnvironmentCreateInput
        ) {
            id
        }
    }
`;

export default CreateIngestEndpointEnvironmentQuery;
