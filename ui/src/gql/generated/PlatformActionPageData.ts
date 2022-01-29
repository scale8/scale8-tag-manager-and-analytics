/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlatformActionPageData
// ====================================================

export interface PlatformActionPageData_getPlatformRevision_platform_actions_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
}

export interface PlatformActionPageData_getPlatformRevision_platform_actions {
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
   * [Optional]. This will force the `PlatformAction` server side and direct the
   * payload described in 'platform_data_maps' as JSON POST request at the provided
   * server-to-server endpoint.
   */
  s2s_endpoint: string | null;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This
   * can be directly accessed by the action when called.
   */
  platform_data_maps: PlatformActionPageData_getPlatformRevision_platform_actions_platform_data_maps[];
}

export interface PlatformActionPageData_getPlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * A list of actions that are associated with this `PlatformRevision`
   */
  platform_actions: PlatformActionPageData_getPlatformRevision_platform_actions[];
}

export interface PlatformActionPageData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: PlatformActionPageData_getPlatformRevision;
}

export interface PlatformActionPageDataVariables {
  id: string;
}
