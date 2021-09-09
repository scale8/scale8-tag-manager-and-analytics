/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Login2FAInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: TwoFactorLogin
// ====================================================

export interface TwoFactorLogin_login2fa {
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

export interface TwoFactorLogin {
  /**
   * @bound=User
   */
  login2fa: TwoFactorLogin_login2fa;
}

export interface TwoFactorLoginVariables {
  login2faInput: Login2FAInput;
}
