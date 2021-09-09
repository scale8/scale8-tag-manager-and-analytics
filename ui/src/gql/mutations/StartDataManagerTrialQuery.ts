import { gql } from '@apollo/client';

const StartDataManagerTrialQuery = gql`
    mutation StartDataManagerTrial($startDataManagerTrialInput: StartDataManagerTrialInput) {
        startDataManagerTrial(startDataManagerTrialInput: $startDataManagerTrialInput) {
            id
        }
    }
`;

export default StartDataManagerTrialQuery;
