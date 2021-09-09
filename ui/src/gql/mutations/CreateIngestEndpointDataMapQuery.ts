import { gql } from '@apollo/client';

const CreateIngestEndpointDataMapQuery = gql`
    mutation CreateIngestEndpointDataMap(
        $ingestEndpointAddIngestEndpointDataMapsInput: IngestEndpointAddIngestEndpointDataMapsInput
    ) {
        addIngestEndpointDataMaps(
            ingestEndpointAddIngestEndpointDataMapsInput: $ingestEndpointAddIngestEndpointDataMapsInput
        ) {
            id
        }
    }
`;

export default CreateIngestEndpointDataMapQuery;
