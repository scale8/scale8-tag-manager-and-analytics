/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrgCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateOrg
// ====================================================

export interface CreateOrg_createOrg {
  __typename: "Org";
  /**
   * A unique `Org` ID
   */
  id: string;
}

export interface CreateOrg {
  /**
   * @bound=Org
   * Create a new `Org`
   */
  createOrg: CreateOrg_createOrg;
}

export interface CreateOrgVariables {
  orgCreateInput: OrgCreateInput;
}
