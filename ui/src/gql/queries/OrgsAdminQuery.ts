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
            tag_manager_account {
                id
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
                enabled
                billing_cycle_requests
            }
            data_manager_account {
                id
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
                enabled
                billing_cycle_requests
                billing_cycle_bytes
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
