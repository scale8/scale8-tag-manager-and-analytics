import { gql } from '@apollo/client';

const DeleteRuleQuery = gql`
    mutation DeleteRule($ruleDeleteInput: RuleDeleteInput!) {
        deleteRule(ruleDeleteInput: $ruleDeleteInput) {
            id
            model
            name
        }
    }
`;

export default DeleteRuleQuery;
