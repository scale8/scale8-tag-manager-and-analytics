import { gql } from '@apollo/client';

const OrgTransferOwnershipQuery = gql`
    mutation OrgTransferOwnershipResult($transferOwnershipInput: TransferOwnershipInput!) {
        transferOwnership(transferOwnershipInput: $transferOwnershipInput)
    }
`;

export default OrgTransferOwnershipQuery;
