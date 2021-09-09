import { gql } from '@apollo/client';

const PageIngestEndpointEnvironmentQuery = gql`
    query IngestEndpointEnvironmentPageData($id: ID!, $ingestQueryOptions: IngestQueryOptions!) {
        getIngestEndpoint(id: $id) {
            id
            ingest_endpoint_environments {
                id
                name
                custom_domain
                install_domain
                config_hint
                storage_provider
                ingest_endpoint_revision {
                    id
                    name
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

export default PageIngestEndpointEnvironmentQuery;
