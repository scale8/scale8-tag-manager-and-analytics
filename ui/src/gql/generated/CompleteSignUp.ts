/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CompleteSignUpInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CompleteSignUp
// ====================================================

export interface CompleteSignUp_completeSignUp_tag_manager {
  __typename: "TagManagerSignUpCompleted";
  app_id: string;
  environment_id: string;
}

export interface CompleteSignUp_completeSignUp_data_manager {
  __typename: "DataManagerSignUpCompleted";
  data_manager_account_id: string;
}

export interface CompleteSignUp_completeSignUp {
  __typename: "SignUpCompleted";
  /**
   * `User` ID
   */
  uid: string;
  /**
   * The `Session` token
   */
  token: string;
  /**
   * True if the user is already existing
   */
  is_duplicate: boolean | null;
  /**
   * Data required for tag manager
   */
  tag_manager: CompleteSignUp_completeSignUp_tag_manager | null;
  /**
   * Data required for data manager
   */
  data_manager: CompleteSignUp_completeSignUp_data_manager | null;
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
