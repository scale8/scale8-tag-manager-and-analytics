import { gql } from '@apollo/client';

const PublishPlatformQuery = gql`
    mutation PublishPlatform($platformPublishInput: PlatformPublishInput!) {
        publishPlatform(platformPublishInput: $platformPublishInput)
    }
`;

export default PublishPlatformQuery;
