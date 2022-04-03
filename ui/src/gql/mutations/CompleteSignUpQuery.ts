import { gql } from '@apollo/client';

const CompleteSignUpQuery = gql`
    mutation CompleteSignUp($completeSignUpInput: CompleteSignUpInput!) {
        completeSignUp(completeSignUpInput: $completeSignUpInput) {
            uid
            token
            is_duplicate
            tag_manager {
                app_id
                environment_id
            }
            data_manager {
                data_manager_account_id
            }
        }
    }
`;

export default CompleteSignUpQuery;
