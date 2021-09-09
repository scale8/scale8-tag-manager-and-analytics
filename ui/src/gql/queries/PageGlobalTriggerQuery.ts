import { gql } from '@apollo/client';

const PageGlobalTriggerQuery = gql`
    query GlobalTriggerData($id: ID!) {
        getRevision(id: $id) {
            id
            locked
            global_triggers {
                id
                name
                events {
                    id
                }
                condition_rules {
                    id
                }
                exception_rules {
                    id
                }
                created_at
                updated_at
            }
        }
    }
`;

export default PageGlobalTriggerQuery;
