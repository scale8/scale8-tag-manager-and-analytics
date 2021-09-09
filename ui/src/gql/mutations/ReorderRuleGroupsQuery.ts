import { gql } from '@apollo/client';

const ReorderRuleGroupsQuery = gql`
    mutation ReorderRuleGroups($tagRuleGroupOrderInput: TagRuleGroupOrderInput!) {
        updateRuleGroupsOrder(tagRuleGroupOrderInput: $tagRuleGroupOrderInput)
    }
`;

export default ReorderRuleGroupsQuery;
