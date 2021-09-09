import { gql } from '@apollo/client';

const UpdateMeQuery = gql`
    mutation UpdateUser($meUpdateInput: MeUpdateInput!) {
        updateMe(meUpdateInput: $meUpdateInput)
    }
`;

export default UpdateMeQuery;
