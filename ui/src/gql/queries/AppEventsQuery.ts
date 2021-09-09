import { gql } from '@apollo/client';

const AppEventsQuery = gql`
    query AppEventsQueryData(
        $id: ID!
        $appQueryOptions: AppQueryOptions!
        $appQueryOptionsGroup: AppQueryOptions!
    ) {
        getApp(id: $id) {
            id
            name
            event_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
            event_group_stats(query_options: $appQueryOptionsGroup) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppEventsQuery;
