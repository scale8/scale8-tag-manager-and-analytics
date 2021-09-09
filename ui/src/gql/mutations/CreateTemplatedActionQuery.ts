import { gql } from '@apollo/client';

const CreateTemplatedActionQuery = gql`
    mutation CreateTemplatedActionResult(
        $platformActionTemplatedCreateInput: PlatformActionTemplatedCreateInput!
    ) {
        createTemplatedAction(
            platformActionTemplatedCreateInput: $platformActionTemplatedCreateInput
        ) {
            id
        }
    }
`;

export default CreateTemplatedActionQuery;
