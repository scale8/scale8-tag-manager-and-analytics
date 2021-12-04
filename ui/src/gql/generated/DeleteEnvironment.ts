/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EnvironmentDeleteInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteEnvironment
// ====================================================

export interface DeleteEnvironment {
  /**
   * @bound=Environment
   * Delete an `Environment`.
   */
  deleteEnvironment: boolean;
}

export interface DeleteEnvironmentVariables {
  environmentDeleteInput: EnvironmentDeleteInput;
}
