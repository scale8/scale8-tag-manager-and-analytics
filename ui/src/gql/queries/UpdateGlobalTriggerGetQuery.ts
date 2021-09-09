import { gql } from '@apollo/client';

const UpdateGlobalTriggerGetQuery = gql`
    query UpdateGlobalTriggerGetData($id: ID!) {
        getTrigger(id: $id) {
            id
            name
        }
    }
`;

export default UpdateGlobalTriggerGetQuery;
