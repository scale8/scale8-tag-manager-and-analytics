import { gql } from '@apollo/client';

const LinkAppPlatformRevisionQuery = gql`
    mutation LinkAppPlatformRevisionValues(
        $appPlatformRevisionLinkInput: AppPlatformRevisionLinkInput!
    ) {
        linkPlatformRevision(appPlatformRevisionLinkInput: $appPlatformRevisionLinkInput) {
            id
            entity
            name
        }
    }
`;

export default LinkAppPlatformRevisionQuery;
