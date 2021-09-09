import { gql } from '@apollo/client';

const CreateRuleGroupQuery = gql`
    mutation CreateRuleGroup($ruleGroupCreateInput: RuleGroupCreateInput!) {
        createRuleGroup(ruleGroupCreateInput: $ruleGroupCreateInput) {
            id
        }
    }
`;

export default CreateRuleGroupQuery;
