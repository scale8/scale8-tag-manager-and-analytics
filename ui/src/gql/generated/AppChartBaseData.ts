/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppChartBaseData
// ====================================================

export interface AppChartBaseData_getApp_revisions {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
}

export interface AppChartBaseData_getApp_environments {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
}

export interface AppChartBaseData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: AppChartBaseData_getApp_revisions[];
  /**
   * Environments connected to the `App`. Environments are used to create a fixed deployment of a Revision
   */
  environments: AppChartBaseData_getApp_environments[];
}

export interface AppChartBaseData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppChartBaseData_getApp;
}

export interface AppChartBaseDataVariables {
  id: string;
}
