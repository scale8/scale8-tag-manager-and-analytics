import { gql } from '@apollo/client';

const DuplicateAppRevisionGetQuery = gql`
    query DuplicateAppRevisionGetData($id: ID!) {
        getRevision(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateAppRevisionGetQuery;
