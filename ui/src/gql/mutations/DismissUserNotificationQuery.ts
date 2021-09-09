import { gql } from '@apollo/client';

const DismissUserNotificationQuery = gql`
    mutation DismissUserNotification($dismissNotificationInput: DismissNotificationInput!) {
        dismissNotification(dismissNotificationInput: $dismissNotificationInput)
    }
`;

export default DismissUserNotificationQuery;
