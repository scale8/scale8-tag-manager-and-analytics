import { gql } from '@apollo/client';

const AppCountriesQuery = gql`
    query AppCountriesQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            country_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppCountriesQuery;
