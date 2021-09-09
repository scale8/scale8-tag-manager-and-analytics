import { gql } from '@apollo/client';

const TagInstructionsQuery = gql`
    query TagInstructionsData($id: ID!) {
        getTag(id: $id) {
            id
            name
            tag_code
            type
            auto_load
        }
    }
`;

export default TagInstructionsQuery;
