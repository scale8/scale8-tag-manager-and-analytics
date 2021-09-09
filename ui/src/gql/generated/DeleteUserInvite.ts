/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrgCancelInviteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteUserInvite
// ====================================================

export interface DeleteUserInvite {
  /**
   * @bound=Org
   * Cancel a user invite to join an `Org`
   */
  cancelInvite: boolean;
}

export interface DeleteUserInviteVariables {
  orgCancelInviteInput: OrgCancelInviteInput;
}
