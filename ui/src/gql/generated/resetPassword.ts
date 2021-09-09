/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ResetPasswordInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: resetPassword
// ====================================================

export interface resetPassword_resetPassword {
  __typename: "UserSession";
  /**
   * `User` ID
   */
  uid: string;
  /**
   * The `Session` token
   */
  token: string;
}

export interface resetPassword {
  /**
   * @bound=User
   */
  resetPassword: resetPassword_resetPassword;
}

export interface resetPasswordVariables {
  resetPasswordInput: ResetPasswordInput;
}
