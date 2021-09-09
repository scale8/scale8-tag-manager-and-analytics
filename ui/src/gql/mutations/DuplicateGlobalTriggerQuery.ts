import { gql } from '@apollo/client';

const DuplicateGlobalTriggerQuery = gql`
    mutation DuplicateGlobalTrigger($triggerDuplicateInput: TriggerDuplicateInput!) {
        duplicateTrigger(triggerDuplicateInput: $triggerDuplicateInput) {
            id
        }
    }
`;

export default DuplicateGlobalTriggerQuery;
