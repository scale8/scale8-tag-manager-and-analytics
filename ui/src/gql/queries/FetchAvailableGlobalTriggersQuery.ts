import { gql } from '@apollo/client';

const FetchAvailableGlobalTriggersQuery = gql`
    query FetchAvailableGlobalTriggers($tagId: ID!) {
        getTag(id: $tagId) {
            id
            revision {
                id
                global_triggers {
                    id
                    name
                }
            }
        }
    }
`;

export default FetchAvailableGlobalTriggersQuery;
