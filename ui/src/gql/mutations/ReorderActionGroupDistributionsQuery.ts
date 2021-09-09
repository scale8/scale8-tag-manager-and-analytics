import { gql } from '@apollo/client';

const ReorderActionGroupDistributionsQuery = gql`
    mutation ReorderActionGroupDistribution($ruleOrderInput: RuleOrderInput!) {
        updateActionDistributionsOrder(ruleOrderInput: $ruleOrderInput)
    }
`;

export default ReorderActionGroupDistributionsQuery;
