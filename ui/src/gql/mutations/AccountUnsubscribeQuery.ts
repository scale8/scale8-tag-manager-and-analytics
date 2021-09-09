import { gql } from '@apollo/client';

const AccountUnsubscribeQuery = gql`
    mutation AccountUnsubscribe($accountUnsubscribeInput: AccountUnsubscribeInput) {
        accountUnsubscribe(accountUnsubscribeInput: $accountUnsubscribeInput)
    }
`;

export default AccountUnsubscribeQuery;
