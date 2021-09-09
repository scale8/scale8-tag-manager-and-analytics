import { gql } from '@apollo/client';

const UnLinkAppPlatformRevisionQuery = gql`
    mutation unLinkAppPlatformRevisionValues(
        $appPlatformRevisionUnlinkInput: AppPlatformRevisionUnlinkInput!
    ) {
        unlinkPlatformRevision(appPlatformRevisionUnlinkInput: $appPlatformRevisionUnlinkInput) {
            id
            entity
            name
        }
    }
`;

export default UnLinkAppPlatformRevisionQuery;
