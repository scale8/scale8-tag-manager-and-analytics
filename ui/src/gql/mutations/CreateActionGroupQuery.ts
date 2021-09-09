import { gql } from '@apollo/client';

const CreateActionGroupQuery = gql`
    mutation CreateActionGroup($actionGroupCreateInput: ActionGroupCreateInput!) {
        createActionGroup(actionGroupCreateInput: $actionGroupCreateInput) {
            id
        }
    }
`;

export default CreateActionGroupQuery;
