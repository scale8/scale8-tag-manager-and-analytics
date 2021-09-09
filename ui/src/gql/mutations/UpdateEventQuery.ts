import { gql } from '@apollo/client';

const UpdateEventQuery = gql`
    mutation UpdateEventResult($eventUpdateInput: EventUpdateInput!) {
        updateEvent(eventUpdateInput: $eventUpdateInput)
    }
`;

export default UpdateEventQuery;
