import { gql } from '@apollo/client';

const DuplicatePlatformRevisionGetQuery = gql`
    query DuplicatePlatformRevisionGetData($id: ID!) {
        getPlatformRevision(id: $id) {
            id
            name
        }
    }
`;

export default DuplicatePlatformRevisionGetQuery;
