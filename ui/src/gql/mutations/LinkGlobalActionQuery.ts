import { gql } from '@apollo/client';

const LinkGlobalActionQuery = gql`
    mutation LinkGlobalActionResult(
        $globalActionGroupDistributionLinkInput: GlobalActionGroupDistributionLinkInput!
    ) {
        linkGlobalActionGroupDistribution(
            globalActionGroupDistributionLinkInput: $globalActionGroupDistributionLinkInput
        )
    }
`;

export default LinkGlobalActionQuery;
