/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrgRemoveMeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteOrgMe
// ====================================================

export interface DeleteOrgMe {
  /**
   * @bound=Org
   * Remove currently logged `User` from an `Org`.
   */
  removeMe: boolean;
}

export interface DeleteOrgMeVariables {
  orgRemoveMeInput: OrgRemoveMeInput;
}
