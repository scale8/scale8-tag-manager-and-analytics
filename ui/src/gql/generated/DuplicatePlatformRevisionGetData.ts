/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicatePlatformRevisionGetData
// ====================================================

export interface DuplicatePlatformRevisionGetData_getPlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
}

export interface DuplicatePlatformRevisionGetData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: DuplicatePlatformRevisionGetData_getPlatformRevision;
}

export interface DuplicatePlatformRevisionGetDataVariables {
  id: string;
}
