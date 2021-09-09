import { gql } from '@apollo/client';

const AppUtmCampaignQuery = gql`
    query AppUtmCampaignQueryData($id: ID!, $appQueryOptions: AppQueryOptions!) {
        getApp(id: $id) {
            id
            name
            utm_campaign_stats(query_options: $appQueryOptions) {
                result {
                    key
                    user_count
                    event_count
                }
            }
        }
    }
`;

export default AppUtmCampaignQuery;
