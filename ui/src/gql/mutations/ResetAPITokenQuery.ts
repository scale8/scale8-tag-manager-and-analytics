import { gql } from '@apollo/client';

const ResetAPITokenQuery = gql`
    mutation ResetAPITokenValues {
        resetAPIToken
    }
`;

export default ResetAPITokenQuery;
