import { gql } from '@apollo/client';

const CreatePlatformQuery = gql`
    mutation CreatePlatformResult($platformCreateInput: PlatformCreateInput!) {
        createPlatform(platformCreateInput: $platformCreateInput) {
            id
        }
    }
`;

export default CreatePlatformQuery;
