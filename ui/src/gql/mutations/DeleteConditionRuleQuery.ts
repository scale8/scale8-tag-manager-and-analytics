import { gql } from '@apollo/client';

const DeleteConditionRuleQuery = gql`
    mutation DeleteConditionRule($conditionRuleDeleteInput: ConditionRuleDeleteInput!) {
        deleteConditionRule(conditionRuleDeleteInput: $conditionRuleDeleteInput) {
            id
        }
    }
`;

export default DeleteConditionRuleQuery;
