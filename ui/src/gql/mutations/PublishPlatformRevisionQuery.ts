import { gql } from '@apollo/client';

const PublishPlatformRevisionQuery = gql`
    mutation PublishPlatformRevision($publishPlatformRevisionInput: PublishPlatformRevisionInput!) {
        publishPlatformRevision(publishPlatformRevisionInput: $publishPlatformRevisionInput)
    }
`;

export default PublishPlatformRevisionQuery;
