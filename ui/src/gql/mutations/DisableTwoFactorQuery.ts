import { gql } from '@apollo/client';

const DisableTwoFactorQuery = gql`
    mutation DisableTwoFactorResult($twoFactorAuthDisableInput: TwoFactorAuthDisableInput!) {
        disableTwoFactorAuth(twoFactorAuthDisableInput: $twoFactorAuthDisableInput)
    }
`;

export default DisableTwoFactorQuery;
