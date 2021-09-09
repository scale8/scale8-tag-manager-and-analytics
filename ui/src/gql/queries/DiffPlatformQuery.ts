import { gql } from '@apollo/client';

const DiffPlatformQuery = gql`
    query DiffPlatform($leftId: ID!, $rightId: ID!) {
        platformRevisionDifference(leftRevisionId: $leftId, rightRevisionId: $rightId) {
            id
            model
            left
            right
            state
            props {
                field
                gqlField
                state
                ref
                left {
                    __typename
                    ... on StringBox {
                        s
                    }
                    ... on IntBox {
                        i
                    }
                    ... on FloatBox {
                        f
                    }
                    ... on BooleanBox {
                        b
                    }
                    ... on DateBox {
                        d
                    }
                    ... on StringArrayBox {
                        sa
                    }
                    ... on IntArrayBox {
                        ia
                    }
                    ... on FloatArrayBox {
                        fa
                    }
                    ... on BooleanArrayBox {
                        ba
                    }
                    ... on DateArrayBox {
                        da
                    }
                    ... on EmptyArrayBox {
                        ea
                    }
                }
                right {
                    __typename
                    ... on StringBox {
                        s
                    }
                    ... on IntBox {
                        i
                    }
                    ... on FloatBox {
                        f
                    }
                    ... on BooleanBox {
                        b
                    }
                    ... on DateBox {
                        d
                    }
                    ... on StringArrayBox {
                        sa
                    }
                    ... on IntArrayBox {
                        ia
                    }
                    ... on FloatArrayBox {
                        fa
                    }
                    ... on BooleanArrayBox {
                        ba
                    }
                    ... on DateArrayBox {
                        da
                    }
                    ... on EmptyArrayBox {
                        ea
                    }
                }
            }
        }
    }
`;

export default DiffPlatformQuery;
