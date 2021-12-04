/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrgAcceptInviteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AcceptUserInvite
// ====================================================

export interface AcceptUserInvite {
  /**
   * @bound=Org
   * Accept a user invite to join an `Org`
   */
  acceptInvite: boolean;
}

export interface AcceptUserInviteVariables {
  orgAcceptInviteInput: OrgAcceptInviteInput;
}
