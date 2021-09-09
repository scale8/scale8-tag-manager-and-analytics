import { gql } from '@apollo/client';

const FinaliseIngestEndpointRevisionQuery = gql`
    mutation FinaliseIngestEndpointRevision(
        $finaliseIngestEndpointRevisionInput: FinaliseIngestEndpointRevisionInput!
    ) {
        finaliseIngestEndpointRevision(
            finaliseIngestEndpointRevisionInput: $finaliseIngestEndpointRevisionInput
        )
    }
`;

export default FinaliseIngestEndpointRevisionQuery;
