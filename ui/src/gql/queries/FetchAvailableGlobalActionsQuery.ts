import { gql } from '@apollo/client';

const FetchAvailableGlobalActionsQuery = gql`
    query FetchAvailableGlobalActions($tagId: ID!, $ruleId: ID!) {
        getTag(id: $tagId) {
            id
            revision {
                id
                global_action_group_distributions {
                    id
                    name
                }
            }
        }
        getRule(id: $ruleId) {
            id
            action_groups_distributions {
                id
            }
        }
    }
`;

export default FetchAvailableGlobalActionsQuery;
