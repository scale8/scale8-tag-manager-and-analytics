import { gql } from '@apollo/client';

const UpdateActionGroupsQuery = gql`
    mutation updateActionGroups($actionGroupUpdateInputs: [ActionGroupUpdateInput!]!) {
        updateActionGroups(actionGroupUpdateInputs: $actionGroupUpdateInputs)
    }
`;

export default UpdateActionGroupsQuery;
