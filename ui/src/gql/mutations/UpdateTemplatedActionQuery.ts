import { gql } from '@apollo/client';

const UpdateTemplatedActionQuery = gql`
    mutation UpdateTemplatedActionResult(
        $platformActionTemplatedUpdateInput: PlatformActionTemplatedUpdateInput!
    ) {
        updateTemplatedAction(
            platformActionTemplatedUpdateInput: $platformActionTemplatedUpdateInput
        )
    }
`;

export default UpdateTemplatedActionQuery;
