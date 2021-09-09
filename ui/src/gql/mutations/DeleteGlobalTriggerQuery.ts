import { gql } from '@apollo/client';

const DeleteGlobalTriggerQuery = gql`
    mutation DeleteGlobalTrigger($triggerDeleteInput: TriggerDeleteInput!) {
        deleteTrigger(triggerDeleteInput: $triggerDeleteInput) {
            id
            model
            name
        }
    }
`;

export default DeleteGlobalTriggerQuery;
