import { gql } from '@apollo/client';

const AcceptUserInviteQuery = gql`
    mutation AcceptUserInvite($orgAcceptInviteInput: OrgAcceptInviteInput!) {
        acceptInvite(orgAcceptInviteInput: $orgAcceptInviteInput)
    }
`;

export default AcceptUserInviteQuery;
