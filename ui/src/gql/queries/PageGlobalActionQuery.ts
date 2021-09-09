import { gql } from '@apollo/client';

const PageGlobalActionQuery = gql`
    query GlobalActionData($id: ID!) {
        getRevision(id: $id) {
            id
            locked
            global_action_group_distributions {
                id
                name
                action_group_distribution_type
                action_groups {
                    id
                }
                created_at
                updated_at
            }
        }
    }
`;

export default PageGlobalActionQuery;
