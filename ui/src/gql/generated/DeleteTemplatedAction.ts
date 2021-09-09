/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PlatformActionTemplatedDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteTemplatedAction
// ====================================================

export interface DeleteTemplatedAction {
  /**
   * @bound=PlatformAction
   * Delete a templated `PlatformAction`
   */
  deleteTemplatedAction: boolean;
}

export interface DeleteTemplatedActionVariables {
  platformActionTemplatedDeleteInput: PlatformActionTemplatedDeleteInput;
}
