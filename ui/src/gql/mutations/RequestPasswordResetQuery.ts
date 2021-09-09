import { gql } from '@apollo/client';

const RequestPasswordResetQuery = gql`
    mutation sendPasswordResetEmail($sendPasswordResetInput: SendPasswordResetInput!) {
        sendPasswordResetEmail(sendPasswordResetInput: $sendPasswordResetInput)
    }
`;

export default RequestPasswordResetQuery;
