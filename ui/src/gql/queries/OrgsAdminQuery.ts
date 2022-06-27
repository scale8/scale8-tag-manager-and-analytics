import { gql } from '@apollo/client';

const OrgsAdminQuery = gql`
    query OrgsAdminPageData {
        me {
            id
            is_admin
            orgs {
                id
            }
        }
        getOrgs {
            id
            name
            is_paid
            has_billing
            manual_invoicing
            billing_start
            billing_end
            tag_manager_account {
                id
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
                enabled
                current_billing_cycle_usage {
                    request_count
                }
            }
            data_manager_account {
                id
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
                enabled
                current_billing_cycle_usage {
                    request_count
                    byte_count
                }
            }
            users {
                id
                owner
                email
                first_name
                last_name
            }
            updated_at
            created_at
        }
    }
`;

export default OrgsAdminQuery;
