import { gql } from '@apollo/client';

const DuplicateActionGroupGetQuery = gql`
    query DuplicateActionGroupGetData($id: ID!) {
        getActionGroup(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateActionGroupGetQuery;
