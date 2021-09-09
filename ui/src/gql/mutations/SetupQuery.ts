import { gql } from '@apollo/client';

const SetupQuery = gql`
    mutation SetupQueryResult($createFirstOrgInput: CreateFirstOrgInput!) {
        createFirstOrg(createFirstOrgInput: $createFirstOrgInput) {
            id
        }
    }
`;

export default SetupQuery;
