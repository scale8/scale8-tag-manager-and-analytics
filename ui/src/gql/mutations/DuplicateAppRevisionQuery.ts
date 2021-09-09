import { gql } from '@apollo/client';

const DuplicateAppRevisionQuery = gql`
    mutation DuplicateAppRevision($duplicateRevisionInput: DuplicateRevisionInput!) {
        duplicateRevision(duplicateRevisionInput: $duplicateRevisionInput) {
            id
        }
    }
`;

export default DuplicateAppRevisionQuery;
