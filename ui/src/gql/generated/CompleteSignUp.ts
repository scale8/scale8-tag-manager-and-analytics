/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CompleteSignUpInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CompleteSignUp
// ====================================================

export interface CompleteSignUp_completeSignUp {
  __typename: "UserSessionLink";
  /**
   * `User` ID
   */
  uid: string;
  /**
   * The `Session` token
   */
  token: string;
  /**
   * The target url after the signup process
   */
  url: string;
  /**
   * The id of the `environment` created during the signup
   */
  environment_id: string | null;
}

export interface CompleteSignUp {
  /**
   * @bound=User
   */
  completeSignUp: CompleteSignUp_completeSignUp;
}

export interface CompleteSignUpVariables {
  completeSignUpInput: CompleteSignUpInput;
}
