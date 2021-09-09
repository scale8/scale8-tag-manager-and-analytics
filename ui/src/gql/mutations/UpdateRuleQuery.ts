import { gql } from '@apollo/client';

const UpdateRuleQuery = gql`
    mutation UpdateRuleResult($ruleUpdateInput: RuleUpdateInput!) {
        updateRule(ruleUpdateInput: $ruleUpdateInput)
    }
`;

export default UpdateRuleQuery;
