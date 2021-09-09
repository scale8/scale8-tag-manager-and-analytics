import { gql } from '@apollo/client';

const DuplicateRuleQuery = gql`
    mutation DuplicateRule($ruleDuplicateInput: RuleDuplicateInput!) {
        duplicateRule(ruleDuplicateInput: $ruleDuplicateInput) {
            id
        }
    }
`;

export default DuplicateRuleQuery;
