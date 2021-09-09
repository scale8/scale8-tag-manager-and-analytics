import { gql } from '@apollo/client';

const ChangePasswordQuery = gql`
    mutation ChangePasswordResult($changePasswordInput: ChangePasswordInput!) {
        changePassword(changePasswordInput: $changePasswordInput)
    }
`;

export default ChangePasswordQuery;
