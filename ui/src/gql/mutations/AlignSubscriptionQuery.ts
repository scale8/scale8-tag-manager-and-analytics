import { gql } from '@apollo/client';

const AlignSubscriptionQuery = gql`
    mutation AlignSubscription($alignSubscriptionInput: AlignSubscriptionInput) {
        alignSubscription(alignSubscriptionInput: $alignSubscriptionInput) {
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
            }
            data_manager_account {
                id
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
                enabled
            }
        }
    }
`;

export default AlignSubscriptionQuery;
