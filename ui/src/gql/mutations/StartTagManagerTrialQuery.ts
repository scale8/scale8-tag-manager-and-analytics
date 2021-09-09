import { gql } from '@apollo/client';

const StartTagManagerTrialQuery = gql`
    mutation StartTagManagerTrial($startTagManagerTrialInput: StartTagManagerTrialInput) {
        startTagManagerTrial(startTagManagerTrialInput: $startTagManagerTrialInput) {
            id
        }
    }
`;

export default StartTagManagerTrialQuery;
