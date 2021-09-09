import { gql } from '@apollo/client';

const HistoryQuery = gql`
    query EntitiesHistory($entities: [ID!]!) {
        getHistoryForEntities(entities: $entities) {
            id
            user {
                id
                first_name
                last_name
            }
            owner
            model_id
            model
            model_persisting_id
            connected_models {
                id
                type
            }
            action
            method
            comments
            created_at
        }
    }
`;

export default HistoryQuery;
