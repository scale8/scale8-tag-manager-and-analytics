import { gql } from '@apollo/client';

const DiffIngestEndpointQuery = gql`
    query DiffIngestEndpoint($leftId: ID!, $rightId: ID!) {
        ingestEndpointRevisionDifference(leftRevisionId: $leftId, rightRevisionId: $rightId) {
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

export default DiffIngestEndpointQuery;
