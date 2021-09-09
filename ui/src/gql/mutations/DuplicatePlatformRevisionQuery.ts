import { gql } from '@apollo/client';

const DuplicatePlatformRevisionQuery = gql`
    mutation DuplicatePlatformRevision(
        $duplicatePlatformRevisionInput: DuplicatePlatformRevisionInput!
    ) {
        duplicatePlatformRevision(duplicatePlatformRevisionInput: $duplicatePlatformRevisionInput) {
            id
        }
    }
`;

export default DuplicatePlatformRevisionQuery;
