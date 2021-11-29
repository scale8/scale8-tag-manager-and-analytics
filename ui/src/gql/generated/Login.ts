/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LoginInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_UserSession {
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

export interface Login_login_TempSession {
  __typename: "TempSession";
  /**
   * `User` ID
   */
  uid: string;
  /**
   * Temporary token to povide on next step of 2-factor auth (see Login2FAInput)
   */
  temp_token: string;
}

export type Login_login = Login_login_UserSession | Login_login_TempSession;

export interface Login {
  /**
   * @bound=User
   */
  login: Login_login;
}

export interface LoginVariables {
  login: LoginInput;
}
