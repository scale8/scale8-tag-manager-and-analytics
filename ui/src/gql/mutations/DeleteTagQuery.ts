import { gql } from '@apollo/client';

const DeleteTagQuery = gql`
    mutation DeleteTag($tagDeleteInput: TagDeleteInput!) {
        deleteTag(tagDeleteInput: $tagDeleteInput) {
            id
            model
            name
        }
    }
`;

export default DeleteTagQuery;
