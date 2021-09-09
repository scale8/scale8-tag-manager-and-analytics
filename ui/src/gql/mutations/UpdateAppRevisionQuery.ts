import { gql } from '@apollo/client';

const UpdateAppRevisionQuery = gql`
    mutation UpdateRevision($revisionUpdateInput: RevisionUpdateInput!) {
        updateRevision(revisionUpdateInput: $revisionUpdateInput)
    }
`;

export default UpdateAppRevisionQuery;
