import { gql } from '@apollo/client';

const DeleteRuleGroupQuery = gql`
    mutation DeleteRuleGroup($ruleGroupDeleteInput: RuleGroupDeleteInput!) {
        deleteRuleGroup(ruleGroupDeleteInput: $ruleGroupDeleteInput) {
            id
            model
            name
        }
    }
`;

export default DeleteRuleGroupQuery;
