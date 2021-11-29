/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrgDeclineInviteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeclineUserInvite
// ====================================================

export interface DeclineUserInvite {
  /**
   * @bound=Org
   * Decline a user invite to join an `Org`
   */
  declineInvite: boolean;
}

export interface DeclineUserInviteVariables {
  orgDeclineInviteInput: OrgDeclineInviteInput;
}
