/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TemplatedActionPageData
// ====================================================

export interface TemplatedActionPageData_getPlatformRevision_platform_actions_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
}

export interface TemplatedActionPageData_getPlatformRevision_platform_actions {
  __typename: "PlatformAction";
  /**
   * ID of the `PlatformAction`
   */
  id: string;
  /**
   * Name of the `PlatformAction`
   */
  name: string;
  /**
   * Description of the `PlatformAction`
   */
  description: string;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This can be directly accessed by the action when called.
   */
  platform_data_maps: TemplatedActionPageData_getPlatformRevision_platform_actions_platform_data_maps[];
}

export interface TemplatedActionPageData_getPlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * Whether or not the `PlatformRevision` has been locked or not. When locked no future changes can be made to the `PlatformRevision` or any of its connected entities
   */
  locked: boolean;
  /**
   * A list of actions that are associated with this `PlatformRevision`
   */
  platform_actions: TemplatedActionPageData_getPlatformRevision_platform_actions[];
}

export interface TemplatedActionPageData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: TemplatedActionPageData_getPlatformRevision;
}

export interface TemplatedActionPageDataVariables {
  id: string;
}
