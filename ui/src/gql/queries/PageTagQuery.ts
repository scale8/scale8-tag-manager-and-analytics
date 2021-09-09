import { gql } from '@apollo/client';

const PageTagQuery = gql`
    query TagPageData($id: ID!) {
        getRevision(id: $id) {
            id
            locked
            tags {
                id
                name
                tag_code
                type
                rule_groups {
                    id
                    name
                }
                height
                width
                auto_load
                created_at
                updated_at
            }
        }
    }
`;

export default PageTagQuery;
