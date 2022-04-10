import { gql } from '@apollo/client';
import { TrackerDatamapsFields } from '../fragments/TrackerDatamapsFields';

const IngestEndpointEnvironmentInstructionsGetQuery = gql`
    query IngestEndpointEnvironmentInstructionsGetData($id: ID!) {
        getIngestEndpointEnvironment(id: $id) {
            id
            name
            cname
            install_domain
            custom_domain
            install_endpoint
            ingest_endpoint_revision {
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
    }
    ${TrackerDatamapsFields}
`;

export default IngestEndpointEnvironmentInstructionsGetQuery;
