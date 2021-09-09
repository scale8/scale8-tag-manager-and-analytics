import { gql } from '@apollo/client';

const LoginQuery = gql`
    mutation Login($login: LoginInput!) {
        login(login: $login) {
            __typename
            ... on UserSession {
                uid
                token
            }
            ... on TempSession {
                uid
                temp_token
            }
        }
    }
`;

export default LoginQuery;
