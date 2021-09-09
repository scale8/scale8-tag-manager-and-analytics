import { gql } from '@apollo/client';

const BillingPortalQuery = gql`
    mutation BillingPortal($billingPortalInput: BillingPortalInput) {
        getBillingPortalUrl(billingPortalInput: $billingPortalInput)
    }
`;

export default BillingPortalQuery;
