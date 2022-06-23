/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AdminAddMeToOrgInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AdminGoIn
// ====================================================

export interface AdminGoIn {
  /**
   * @bound=Org
   * A system admin can add himself to an `Org`, in order to offer support
   */
  adminAddMeToOrg: boolean;
}

export interface AdminGoInVariables {
  adminAddMeToOrgInput: AdminAddMeToOrgInput;
}
