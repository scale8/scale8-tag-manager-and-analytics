import { gql } from '@apollo/client';

const DuplicateTagQuery = gql`
    mutation DuplicateTag($tagDuplicateInput: TagDuplicateInput!) {
        duplicateTag(tagDuplicateInput: $tagDuplicateInput) {
            id
        }
    }
`;

export default DuplicateTagQuery;
