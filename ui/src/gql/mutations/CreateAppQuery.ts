import { gql } from '@apollo/client';

const CreateAppQuery = gql`
    mutation CreateApp($appCreateInput: AppCreateInput!) {
        createApp(appCreateInput: $appCreateInput) {
            id
        }
    }
`;

export default CreateAppQuery;
