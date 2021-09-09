/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteApp
// ====================================================

export interface DeleteApp {
  /**
   * @bound=App
   * Delete a `App` and its children.
   */
  deleteApp: boolean;
}

export interface DeleteAppVariables {
  appDeleteInput: AppDeleteInput;
}
