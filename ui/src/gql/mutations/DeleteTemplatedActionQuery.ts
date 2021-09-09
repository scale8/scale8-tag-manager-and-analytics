import { gql } from '@apollo/client';

const DeleteTemplatedActionQuery = gql`
    mutation DeleteTemplatedAction(
        $platformActionTemplatedDeleteInput: PlatformActionTemplatedDeleteInput!
    ) {
        deleteTemplatedAction(
            platformActionTemplatedDeleteInput: $platformActionTemplatedDeleteInput
        )
    }
`;

export default DeleteTemplatedActionQuery;
