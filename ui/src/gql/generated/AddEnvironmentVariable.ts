/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EnvironmentVariableAddInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddEnvironmentVariable
// ====================================================

export interface AddEnvironmentVariable {
  /**
   * @bound=Environment
   * Add an environment variable
   */
  addEnvironmentVariable: boolean;
}

export interface AddEnvironmentVariableVariables {
  environmentVariableAddInput: EnvironmentVariableAddInput;
}
