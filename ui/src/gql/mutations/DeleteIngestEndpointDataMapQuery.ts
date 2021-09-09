import { gql } from '@apollo/client';

const DeleteIngestEndpointDataMapQuery = gql`
    mutation DeleteIngestEndpointDataMap(
        $deleteChildIngestEndpointDataMapInput: DeleteChildIngestEndpointDataMapInput!
    ) {
        deleteIngestEndpointDataMap(
            deleteChildIngestEndpointDataMapInput: $deleteChildIngestEndpointDataMapInput
        ) {
            id
        }
    }
`;

export default DeleteIngestEndpointDataMapQuery;
