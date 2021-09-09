import { gql } from '@apollo/client';

const CreateTagQuery = gql`
    mutation CreateTagResult($tagCreateInput: TagCreateInput!) {
        createTag(tagCreateInput: $tagCreateInput) {
            id
        }
    }
`;

export default CreateTagQuery;
