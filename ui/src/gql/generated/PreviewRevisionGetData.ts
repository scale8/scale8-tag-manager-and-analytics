/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PreviewRevisionGetData
// ====================================================

export interface PreviewRevisionGetData_getRevision_app_environments {
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
   * `Environment` URL
   */
  url: string | null;
}

export interface PreviewRevisionGetData_getRevision_app {
  __typename: "App";
  /**
   * Environments connected to the `App`. Environments are used to create a fixed deployment of a Revision
   */
  environments: PreviewRevisionGetData_getRevision_app_environments[];
}

export interface PreviewRevisionGetData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision Name
   */
  name: string;
  /**
   * App
   */
  app: PreviewRevisionGetData_getRevision_app;
}

export interface PreviewRevisionGetData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: PreviewRevisionGetData_getRevision;
}

export interface PreviewRevisionGetDataVariables {
  id: string;
}
