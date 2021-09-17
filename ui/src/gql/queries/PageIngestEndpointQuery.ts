import { gql } from '@apollo/client';

const PageIngestEndpointQuery = gql`
    query IngestEndpointPageData($id: ID!, $ingestQueryOptions: IngestQueryOptions!) {
        getDataManagerAccount(id: $id) {
            id
            ingest_endpoints {
                id
                name
                analytics_enabled
                ingest_endpoint_revisions {
                    id
                }
                ingest_endpoint_environments {
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

export default PageIngestEndpointQuery;
