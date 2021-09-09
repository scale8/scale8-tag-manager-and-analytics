import { gql } from '@apollo/client';

const UpdateGlobalTriggerQuery = gql`
    mutation UpdateGlobalTriggerResult($triggerUpdateInput: TriggerUpdateInput!) {
        updateTrigger(triggerUpdateInput: $triggerUpdateInput)
    }
`;

export default UpdateGlobalTriggerQuery;
