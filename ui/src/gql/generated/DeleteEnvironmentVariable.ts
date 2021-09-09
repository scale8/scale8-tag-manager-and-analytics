/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EnvironmentVariableDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteEnvironmentVariable
// ====================================================

export interface DeleteEnvironmentVariable {
  /**
   * @bound=Environment
   * Delete an environment variable
   */
  deleteEnvironmentVariable: boolean;
}

export interface DeleteEnvironmentVariableVariables {
  environmentVariableDeleteInput: EnvironmentVariableDeleteInput;
}
