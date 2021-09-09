import { gql } from '@apollo/client';

const UpdateTagQuery = gql`
    mutation UpdateTagResult($tagUpdateInput: TagUpdateInput!) {
        updateTag(tagUpdateInput: $tagUpdateInput)
    }
`;

export default UpdateTagQuery;
