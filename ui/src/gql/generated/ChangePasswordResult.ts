/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ChangePasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ChangePasswordResult
// ====================================================

export interface ChangePasswordResult {
  /**
   * @bound=User
   * Change currently logged `User`'s password
   */
  changePassword: boolean;
}

export interface ChangePasswordResultVariables {
  changePasswordInput: ChangePasswordInput;
}
