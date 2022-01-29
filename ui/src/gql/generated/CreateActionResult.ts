/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ActionCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateActionResult
// ====================================================

export interface CreateActionResult_createAction {
  __typename: "Action";
  /**
   * `Action` ID
   */
  id: string;
}

export interface CreateActionResult {
  /**
   * @bound=Action
   * Create a new `Action`.
   */
  createAction: CreateActionResult_createAction;
}

export interface CreateActionResultVariables {
  actionCreateInput: ActionCreateInput;
}
