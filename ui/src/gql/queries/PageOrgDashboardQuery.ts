import { gql } from '@apollo/client';

const PageOrgDashboardQuery = gql`
    query OrgDashboardPageData(
        $id: ID!
        $appQueryOptions: AppQueryOptions!
        $ingestQueryOptions: IngestQueryOptions!
    ) {
        getOrg(id: $id) {
            id
            name
            tag_manager_account {
                id
                apps {
                    id
                    name
                    event_request_stats(query_options: $appQueryOptions) {
                        from
                        to
                        result {
                            key
                            user_count
                            event_count
                        }
                    }
                }
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
            }
            data_manager_account {
                id
                ingest_endpoints {
                    id
                    name
                    request_stats(query_options: $ingestQueryOptions) {
                        from
                        to
                        result {
                            key
                            count
                        }
                    }
                    byte_stats(query_options: $ingestQueryOptions) {
                        from
                        to
                        result {
                            key
                            count
                        }
                    }
                }
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
            }
            me {
                id
                can_create_tag_manager_trial
                can_create_data_manager_trial
            }
            users {
                id
            }
        }
    }
`;

export default PageOrgDashboardQuery;
