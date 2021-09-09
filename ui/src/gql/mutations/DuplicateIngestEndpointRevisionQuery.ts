import { gql } from '@apollo/client';

const DuplicateIngestEndpointRevisionQuery = gql`
    mutation DuplicateIngestEndpointRevision(
        $duplicateIngestEndpointRevisionInput: DuplicateIngestEndpointRevisionInput!
    ) {
        duplicateIngestEndpointRevision(
            duplicateIngestEndpointRevisionInput: $duplicateIngestEndpointRevisionInput
        ) {
            id
        }
    }
`;

export default DuplicateIngestEndpointRevisionQuery;
