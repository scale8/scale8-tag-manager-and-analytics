import { gql } from '@apollo/client';

const InstallAppPlatformQuery = gql`
    mutation InstallPlatform($appInstallPlatformInput: AppInstallPlatformInput!) {
        installPlatform(appInstallPlatformInput: $appInstallPlatformInput) {
            id
        }
    }
`;

export default InstallAppPlatformQuery;
