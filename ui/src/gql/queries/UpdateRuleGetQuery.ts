import { gql } from '@apollo/client';

const UpdateRuleGetQuery = gql`
    query UpdateRuleGetData($id: ID!) {
        getRule(id: $id) {
            id
            name
            min_repeat_interval
        }
    }
`;

export default UpdateRuleGetQuery;
