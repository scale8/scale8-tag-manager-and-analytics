/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SignUpInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_signUp {
  __typename: "SignUpResult";
  /**
   * The email of the user signing up
   */
  email: string;
  /**
   * The request token used to skip email validation (invite)
   */
  request_token: string | null;
}

export interface SignUp {
  /**
   * @bound=User
   */
  signUp: SignUp_signUp;
}

export interface SignUpVariables {
  signUpInput: SignUpInput;
}
