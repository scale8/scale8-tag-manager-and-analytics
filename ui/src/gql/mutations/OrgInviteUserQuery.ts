import { gql } from '@apollo/client';

const OrgInviteUserQuery = gql`
    mutation InviteOrgUserResult($orgInviteUserInput: OrgInviteUserInput!) {
        inviteUser(orgInviteUserInput: $orgInviteUserInput)
    }
`;

export default OrgInviteUserQuery;
