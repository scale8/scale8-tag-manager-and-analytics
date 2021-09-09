import { gql } from '@apollo/client';

const RegenerateOrgUserPasswordQuery = gql`
    mutation RegeneratePassword($regenerateUserPasswordInput: RegenerateUserPasswordInput!) {
        regenerateUserPassword(regenerateUserPasswordInput: $regenerateUserPasswordInput)
    }
`;

export default RegenerateOrgUserPasswordQuery;
