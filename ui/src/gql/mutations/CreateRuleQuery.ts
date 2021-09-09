import { gql } from '@apollo/client';

const CreateRuleQuery = gql`
    mutation CreateRuleResult($ruleCreateInput: RuleCreateInput!) {
        createRule(ruleCreateInput: $ruleCreateInput) {
            id
        }
    }
`;

export default CreateRuleQuery;
