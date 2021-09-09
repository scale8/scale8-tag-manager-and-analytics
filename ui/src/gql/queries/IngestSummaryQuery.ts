import { gql } from '@apollo/client';

const IngestSummaryQuery = gql`
    query IngestSummaryQueryData(
        $id: ID!
        $ingestQueryOptions: IngestQueryOptions!
        $ingestQueryOptionsPrev: IngestQueryOptions!
    ) {
        getIngestEndpoint(id: $id) {
            id
            name
            request_stats(query_options: $ingestQueryOptions) {
                result {
                    key
                    count
                }
            }
            byte_stats(query_options: $ingestQueryOptions) {
                result {
                    key
                    count
                }
            }
            prev_request_stats: request_stats(query_options: $ingestQueryOptionsPrev) {
                result {
                    key
                    count
                }
            }
            prev_byte_stats: byte_stats(query_options: $ingestQueryOptionsPrev) {
                result {
                    key
                    count
                }
            }
        }
    }
`;

export default IngestSummaryQuery;
