import { gql } from '@apollo/client';

const UpdateActionGroupGetQuery = gql`
    query UpdateActionGroupGetData($id: ID!) {
        getActionGroup(id: $id) {
            id
            name
        }
    }
`;

export default UpdateActionGroupGetQuery;
