import { gql } from '@apollo/client';

const UpdateAppQuery = gql`
    mutation UpdateApp($appUpdateInput: AppUpdateInput!) {
        updateApp(appUpdateInput: $appUpdateInput)
    }
`;

export default UpdateAppQuery;
