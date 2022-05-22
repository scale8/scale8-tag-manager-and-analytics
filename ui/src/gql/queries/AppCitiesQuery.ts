import { gql } from '@apollo/client';

const AppCitiesQuery = gql`
    query AppCitiesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            city_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppCitiesQuery;
