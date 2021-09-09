import { gql } from '@apollo/client';

const CompleteSignUpQuery = gql`
    mutation CompleteSignUp($completeSignUpInput: CompleteSignUpInput!) {
        completeSignUp(completeSignUpInput: $completeSignUpInput) {
            uid
            token
            url
            environment_id
        }
    }
`;

export default CompleteSignUpQuery;
