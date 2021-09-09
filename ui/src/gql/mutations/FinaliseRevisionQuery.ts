import { gql } from '@apollo/client';

const FinaliseRevisionQuery = gql`
    mutation FinaliseRevision($finaliseRevisionInput: FinaliseRevisionInput!) {
        finaliseRevision(finaliseRevisionInput: $finaliseRevisionInput) {
            modelId
            model
            issue
            gqlField
        }
    }
`;

export default FinaliseRevisionQuery;
