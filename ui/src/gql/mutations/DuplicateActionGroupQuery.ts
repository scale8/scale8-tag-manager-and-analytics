import { gql } from '@apollo/client';

const DuplicateActionGroupQuery = gql`
    mutation DuplicateActionGroup($actionGroupDuplicateInput: ActionGroupDuplicateInput!) {
        duplicateActionGroup(actionGroupDuplicateInput: $actionGroupDuplicateInput) {
            id
        }
    }
`;

export default DuplicateActionGroupQuery;
