import { gql } from '@apollo/client';

const DuplicateRuleGroupGetQuery = gql`
    query DuplicateRuleGroupGetData($id: ID!) {
        getRuleGroup(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateRuleGroupGetQuery;
