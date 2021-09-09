import { gql } from '@apollo/client';

const UpdateConditionRuleQuery = gql`
    mutation UpdateConditionRule($conditionRuleUpdateInput: ConditionRuleUpdateInput!) {
        updateConditionRule(conditionRuleUpdateInput: $conditionRuleUpdateInput)
    }
`;

export default UpdateConditionRuleQuery;
