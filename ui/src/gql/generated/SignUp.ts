/* tslint:disable */
/* eslint-disable */
// @generated
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
