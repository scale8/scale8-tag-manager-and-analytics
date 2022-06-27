import { gql } from '@apollo/client';

const AdminManualInvoicingQuery = gql`
    mutation AdminManualInvoicing($switchToManualInvoicingInput: SwitchToManualInvoicingInput!) {
        switchToManualInvoicing(switchToManualInvoicingInput: $switchToManualInvoicingInput)
    }
`;

export default AdminManualInvoicingQuery;
