/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DeployAppRevisionGetData
// ====================================================

export interface DeployAppRevisionGetData_getRevision_app_environments_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
}

export interface DeployAppRevisionGetData_getRevision_app_environments {
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
   * `Revision` currently attached to the `Environment`
   */
  revision: DeployAppRevisionGetData_getRevision_app_environments_revision;
}

export interface DeployAppRevisionGetData_getRevision_app {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Environments connected to the `App`. Environments are used to create a fixed deployment of a Revision
   */
  environments: DeployAppRevisionGetData_getRevision_app_environments[];
}

export interface DeployAppRevisionGetData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * App
   */
  app: DeployAppRevisionGetData_getRevision_app;
}

export interface DeployAppRevisionGetData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: DeployAppRevisionGetData_getRevision;
}

export interface DeployAppRevisionGetDataVariables {
  id: string;
}
