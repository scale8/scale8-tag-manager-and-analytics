/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdatePlatformRevisionGetData
// ====================================================

export interface UpdatePlatformRevisionGetData_getPlatformRevision {
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

export interface UpdatePlatformRevisionGetData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: UpdatePlatformRevisionGetData_getPlatformRevision;
}

export interface UpdatePlatformRevisionGetDataVariables {
  id: string;
}
