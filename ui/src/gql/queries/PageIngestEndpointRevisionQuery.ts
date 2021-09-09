import { gql } from '@apollo/client';

const PageIngestEndpointRevisionQuery = gql`
    query IngestEndpointRevisionPageData($id: ID!, $ingestQueryOptions: IngestQueryOptions!) {
        getIngestEndpoint(id: $id) {
            id
            ingest_endpoint_revisions {
                id
                name
                locked
                ingest_endpoint_data_maps {
                    id
                }
                request_stats(query_options: $ingestQueryOptions) {
                    from
                    to
                    result {
                        key
                        count
                    }
                }
                byte_stats(query_options: $ingestQueryOptions) {
                    from
                    to
                    result {
                        key
                        count
                    }
                }
                created_at
                updated_at
            }
        }
    }
`;

export default PageIngestEndpointRevisionQuery;
