import { gql } from '@apollo/client';

const UpdatePlatformRevisionQuery = gql`
    mutation UpdatePlatformRevision($revisionPlatformUpdateInput: RevisionPlatformUpdateInput!) {
        updatePlatformRevision(revisionPlatformUpdateInput: $revisionPlatformUpdateInput)
    }
`;

export default UpdatePlatformRevisionQuery;
