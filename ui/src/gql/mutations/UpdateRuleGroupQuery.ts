import { gql } from '@apollo/client';

const UpdateRuleGroupQuery = gql`
    mutation UpdateRuleGroup($ruleGroupUpdateInput: RuleGroupUpdateInput!) {
        updateRuleGroup(ruleGroupUpdateInput: $ruleGroupUpdateInput)
    }
`;

export default UpdateRuleGroupQuery;
