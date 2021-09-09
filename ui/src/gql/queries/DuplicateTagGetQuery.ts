import { gql } from '@apollo/client';

const DuplicateTagGetQuery = gql`
    query DuplicateTagGetData($id: ID!) {
        getTag(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateTagGetQuery;
