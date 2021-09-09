import { gql } from '@apollo/client';

const IngestChartQuery = gql`
    query IngestChartQueryData($id: ID!, $ingestQueryOptions: IngestQueryOptions!) {
        getIngestEndpoint(id: $id) {
            id
            name
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
        }
    }
`;

export default IngestChartQuery;
