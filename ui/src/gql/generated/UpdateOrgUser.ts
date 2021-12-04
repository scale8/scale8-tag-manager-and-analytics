/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { OrgUpdateUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateOrgUser
// ====================================================

export interface UpdateOrgUser {
  /**
   * @bound=Org
   * Update a `User`'s permissions against an `Org`
   */
  updateUserPermissions: boolean;
}

export interface UpdateOrgUserVariables {
  orgUpdateUserInput: OrgUpdateUserInput;
}
