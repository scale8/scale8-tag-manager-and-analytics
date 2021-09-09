import { gql } from '@apollo/client';

const TwoFactorLoginQuery = gql`
    mutation TwoFactorLogin($login2faInput: Login2FAInput!) {
        login2fa(login2faInput: $login2faInput) {
            uid
            token
        }
    }
`;

export default TwoFactorLoginQuery;
