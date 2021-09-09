/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdatePlatformGetData
// ====================================================

export interface UpdatePlatformGetData_getPlatform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
  /**
   * `Platform` description
   */
  description: string;
}

export interface UpdatePlatformGetData {
  /**
   * @bound=Platform
   * Method will return a `Platform` instance from its ID.
   * 
   * !> Note that if the `Platform` has been made public, it will be accessible to ***any*** Scale8 Tag Manager User.
   */
  getPlatform: UpdatePlatformGetData_getPlatform;
}

export interface UpdatePlatformGetDataVariables {
  id: string;
}
