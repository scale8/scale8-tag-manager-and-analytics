import { gql } from '@apollo/client';

const UpdateRuleGroupGetQuery = gql`
    query UpdateRuleGroupGetData($id: ID!) {
        getRuleGroup(id: $id) {
            id
            name
        }
    }
`;

export default UpdateRuleGroupGetQuery;
