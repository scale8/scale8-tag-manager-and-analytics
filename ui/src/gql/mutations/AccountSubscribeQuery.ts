import { gql } from '@apollo/client';

const AccountSubscribeQuery = gql`
    mutation AccountSubscribe($accountSubscribeInput: AccountSubscribeInput) {
        accountSubscribe(accountSubscribeInput: $accountSubscribeInput)
    }
`;

export default AccountSubscribeQuery;
