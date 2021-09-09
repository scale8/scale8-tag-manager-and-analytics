import { gql } from '@apollo/client';

const DeclineUserInviteQuery = gql`
    mutation DeclineUserInvite($orgDeclineInviteInput: OrgDeclineInviteInput!) {
        declineInvite(orgDeclineInviteInput: $orgDeclineInviteInput)
    }
`;

export default DeclineUserInviteQuery;
