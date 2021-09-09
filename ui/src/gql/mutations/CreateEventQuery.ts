import { gql } from '@apollo/client';

const CreateEventQuery = gql`
    mutation CreateEventResult($eventCreateInput: EventCreateInput!) {
        createEvent(eventCreateInput: $eventCreateInput) {
            id
        }
    }
`;

export default CreateEventQuery;
