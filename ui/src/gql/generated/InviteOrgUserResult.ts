/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrgInviteUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: InviteOrgUserResult
// ====================================================

export interface InviteOrgUserResult {
  /**
   * @bound=Org
   * Invite a user to join an `Org`
   */
  inviteUser: boolean;
}

export interface InviteOrgUserResultVariables {
  orgInviteUserInput: OrgInviteUserInput;
}
