import { gql } from '@apollo/client';

const DeleteEventQuery = gql`
    mutation DeleteEvent($eventDeleteInput: EventDeleteInput!) {
        deleteEvent(eventDeleteInput: $eventDeleteInput) {
            id
        }
    }
`;

export default DeleteEventQuery;
