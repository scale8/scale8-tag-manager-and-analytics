import { gql } from '@apollo/client';

const DuplicateIngestEndpointRevisionGetQuery = gql`
    query DuplicateIngestEndpointRevisionGetData($id: ID!) {
        getIngestEndpointRevision(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateIngestEndpointRevisionGetQuery;
