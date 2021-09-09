import { gql } from '@apollo/client';
import { TrackerDatamapsFields } from '../fragments/TrackerDatamapsFields';

const IngestEndpointRevisionPayloadPreviewGetQuery = gql`
    query IngestEndpointRevisionPayloadPreviewGetData($id: ID!) {
        getIngestEndpointRevision(id: $id) {
            id
            ingest_endpoint_data_maps {
                ...trackerDatamapsFields
                child_ingest_endpoint_data_maps {
                    ...trackerDatamapsFields
                    child_ingest_endpoint_data_maps {
                        ...trackerDatamapsFields
                    }
                }
            }
        }
    }
    ${TrackerDatamapsFields}
`;

export default IngestEndpointRevisionPayloadPreviewGetQuery;
