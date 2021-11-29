/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrgRemoveUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteOrgUser
// ====================================================

export interface DeleteOrgUser {
  /**
   * @bound=Org
   * Remove a `User` from an `Org`.
   */
  removeUser: boolean;
}

export interface DeleteOrgUserVariables {
  orgRemoveUserInput: OrgRemoveUserInput;
}
