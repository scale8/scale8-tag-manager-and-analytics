import { gql } from '@apollo/client';
import { TrackerDatamapsFields } from '../fragments/TrackerDatamapsFields';

const PageIngestEndpointDataMapQuery = gql`
    query IngestEndpointDataMapPageData($id: ID!) {
        getIngestEndpointRevision(id: $id) {
            id
            locked
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

export default PageIngestEndpointDataMapQuery;
