/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateApp
// ====================================================

export interface UpdateApp {
  /**
   * @bound=App
   * Update a `App`'s details.
   */
  updateApp: boolean;
}

export interface UpdateAppVariables {
  appUpdateInput: AppUpdateInput;
}
