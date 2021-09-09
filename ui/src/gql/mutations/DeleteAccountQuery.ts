import { gql } from '@apollo/client';

const DeleteAccountQuery = gql`
    mutation DeleteAccount {
        deleteMe
    }
`;

export default DeleteAccountQuery;
