import { gql } from '@apollo/client';

const UpdateAppGetQuery = gql`
    query UpdateAppGetData($id: ID!) {
        getApp(id: $id) {
            id
            name
            domain
            type
            analytics_enabled
            error_tracking_enabled
            storage_provider
        }
    }
`;

export default UpdateAppGetQuery;
