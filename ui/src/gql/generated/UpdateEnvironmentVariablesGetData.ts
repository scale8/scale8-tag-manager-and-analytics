/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateEnvironmentVariablesGetData
// ====================================================

export interface UpdateEnvironmentVariablesGetData_getEnvironment_environment_variables {
  __typename: "EnvironmentVariable";
  key: string;
  value: string;
}

export interface UpdateEnvironmentVariablesGetData_getEnvironment {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
  /**
   * Environment variables associated with this `Environment`
   */
  environment_variables: UpdateEnvironmentVariablesGetData_getEnvironment_environment_variables[];
}

export interface UpdateEnvironmentVariablesGetData {
  /**
   * @bound=Environment
   * Get an `Environment` model from `Environment` ID
   */
  getEnvironment: UpdateEnvironmentVariablesGetData_getEnvironment;
}

export interface UpdateEnvironmentVariablesGetDataVariables {
  id: string;
}
