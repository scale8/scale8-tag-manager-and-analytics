import { gql } from '@apollo/client';

const ProductSettingsQuery = gql`
    query ProductSettings($id: ID!) {
        getOrg(id: $id) {
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
            }
            data_manager_account {
                id
                trial_expires_in
                trial_expired
                stripe_product_id
                is_trial
            }
            me {
                id
                owner
            }
        }
    }
`;

export default ProductSettingsQuery;
