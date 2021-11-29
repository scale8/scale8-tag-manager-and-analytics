/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EnvironmentCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateEnvironment
// ====================================================

export interface CreateEnvironment_createEnvironment {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
}

export interface CreateEnvironment {
  /**
   * @bound=Environment
   * Create a new `Environment`.
   */
  createEnvironment: CreateEnvironment_createEnvironment;
}

export interface CreateEnvironmentVariables {
  environmentCreateInput: EnvironmentCreateInput;
}
