import { gql } from '@apollo/client';

const EnableTwoFactorQuery = gql`
    mutation EnableTwoFactorResult($twoFactorAuthEnableInput: TwoFactorAuthEnableInput!) {
        enableTwoFactorAuth(twoFactorAuthEnableInput: $twoFactorAuthEnableInput)
    }
`;

export default EnableTwoFactorQuery;
