import { gql } from '@apollo/client';

const UnLinkGlobalActionQuery = gql`
    mutation UnLinkGlobalActionResult(
        $globalActionGroupDistributionUnlinkInput: GlobalActionGroupDistributionUnlinkInput!
    ) {
        unlinkGlobalActionGroupDistribution(
            globalActionGroupDistributionUnlinkInput: $globalActionGroupDistributionUnlinkInput
        )
    }
`;

export default UnLinkGlobalActionQuery;
