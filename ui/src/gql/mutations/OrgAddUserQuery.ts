import { gql } from '@apollo/client';

const OrgAddUserQuery = gql`
    mutation AddOrgUserResult($orgAddUserInput: OrgAddUserInput!) {
        addUser(orgAddUserInput: $orgAddUserInput) {
            id
        }
    }
`;

export default OrgAddUserQuery;
