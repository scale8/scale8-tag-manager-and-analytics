import { gql } from '@apollo/client';

const UpdateOrgGetQuery = gql`
    query UpdateOrgGetData($id: ID!) {
        getOrg(id: $id) {
            id
            name
        }
    }
`;

export default UpdateOrgGetQuery;
