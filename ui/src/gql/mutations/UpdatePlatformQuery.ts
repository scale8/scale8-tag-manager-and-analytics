import { gql } from '@apollo/client';

const UpdatePlatformQuery = gql`
    mutation UpdatePlatformResult($platformUpdateInput: PlatformUpdateInput!) {
        updatePlatform(platformUpdateInput: $platformUpdateInput)
    }
`;

export default UpdatePlatformQuery;
