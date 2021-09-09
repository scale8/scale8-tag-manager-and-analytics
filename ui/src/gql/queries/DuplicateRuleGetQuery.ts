import { gql } from '@apollo/client';

const DuplicateRuleGetQuery = gql`
    query DuplicateRuleGetData($id: ID!) {
        getRule(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateRuleGetQuery;
