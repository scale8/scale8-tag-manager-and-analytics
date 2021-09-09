import { gql } from '@apollo/client';

const CreateGlobalTriggerQuery = gql`
    mutation CreateGlobalTriggerResult($triggerCreateInput: TriggerCreateInput!) {
        createTrigger(triggerCreateInput: $triggerCreateInput) {
            id
        }
    }
`;

export default CreateGlobalTriggerQuery;
