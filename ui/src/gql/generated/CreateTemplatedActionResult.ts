/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlatformActionTemplatedCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTemplatedActionResult
// ====================================================

export interface CreateTemplatedActionResult_createTemplatedAction {
  __typename: "PlatformAction";
  /**
   * ID of the `PlatformAction`
   */
  id: string;
}

export interface CreateTemplatedActionResult {
  /**
   * @bound=PlatformAction
   * Create a new templated `PlatformAction`
   */
  createTemplatedAction: CreateTemplatedActionResult_createTemplatedAction;
}

export interface CreateTemplatedActionResultVariables {
  platformActionTemplatedCreateInput: PlatformActionTemplatedCreateInput;
}
