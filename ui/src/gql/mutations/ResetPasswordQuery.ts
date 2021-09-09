import { gql } from '@apollo/client';

const ResetPasswordQuery = gql`
    mutation resetPassword($resetPasswordInput: ResetPasswordInput!) {
        resetPassword(resetPasswordInput: $resetPasswordInput) {
            uid
            token
        }
    }
`;

export default ResetPasswordQuery;
