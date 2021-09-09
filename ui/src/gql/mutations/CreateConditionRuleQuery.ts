import { gql } from '@apollo/client';

const CreateConditionRuleQuery = gql`
    mutation CreateConditionRule($conditionRuleCreateInput: ConditionRuleCreateInput!) {
        createConditionRule(conditionRuleCreateInput: $conditionRuleCreateInput) {
            id
        }
    }
`;

export default CreateConditionRuleQuery;
