/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrgDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteOrg
// ====================================================

export interface DeleteOrg {
  /**
   * @bound=Org
   * Delete an `Org` and all child entities
   */
  deleteOrg: boolean;
}

export interface DeleteOrgVariables {
  orgDeleteInput: OrgDeleteInput;
}
