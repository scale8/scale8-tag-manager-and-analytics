import { gql } from '@apollo/client';

const PrepareTwoFactorQuery = gql`
    query PrepareTwoFactor {
        prepareTwoFactor
        me {
            email
        }
    }
`;

export default PrepareTwoFactorQuery;
