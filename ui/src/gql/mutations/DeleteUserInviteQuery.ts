import { gql } from '@apollo/client';

const DeleteUserInviteQuery = gql`
    mutation DeleteUserInvite($orgCancelInviteInput: OrgCancelInviteInput!) {
        cancelInvite(orgCancelInviteInput: $orgCancelInviteInput)
    }
`;

export default DeleteUserInviteQuery;
