import { gql } from '@apollo/client';

const DuplicateRuleGroupQuery = gql`
    mutation DuplicateRuleGroup($ruleGroupDuplicateInput: RuleGroupDuplicateInput!) {
        duplicateRuleGroup(ruleGroupDuplicateInput: $ruleGroupDuplicateInput) {
            id
        }
    }
`;

export default DuplicateRuleGroupQuery;
