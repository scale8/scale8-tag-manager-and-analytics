import { gql } from '@apollo/client';

const ReorderRulesQuery = gql`
    mutation ReorderRules($ruleGroupRuleOrderInput: RuleGroupRuleOrderInput!) {
        updateRulesOrder(ruleGroupRuleOrderInput: $ruleGroupRuleOrderInput)
    }
`;

export default ReorderRulesQuery;
