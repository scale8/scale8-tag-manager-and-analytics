/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActionGroupDistributionCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGlobalActionResult
// ====================================================

export interface CreateGlobalActionResult_createActionGroupDistribution {
  __typename: "ActionGroupDistribution";
  /**
   * `ActionGroupDistribution` ID
   */
  id: string;
}

export interface CreateGlobalActionResult {
  /**
   * @bound=ActionGroupDistribution
   * Create a new `ActionGroupDistribution`. `Rule` ID is required here to ensure `ActionGroupDistribution` is placed inside the correct version
   */
  createActionGroupDistribution: CreateGlobalActionResult_createActionGroupDistribution;
}

export interface CreateGlobalActionResultVariables {
  actionGroupDistributionCreateInput: ActionGroupDistributionCreateInput;
}
