import { gql } from '@apollo/client';

const DuplicateGlobalTriggerGetQuery = gql`
    query DuplicateGlobalTriggerGetData($id: ID!) {
        getTrigger(id: $id) {
            id
            name
        }
    }
`;

export default DuplicateGlobalTriggerGetQuery;
