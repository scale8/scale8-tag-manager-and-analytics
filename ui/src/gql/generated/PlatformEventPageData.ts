/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlatformEventPageData
// ====================================================

export interface PlatformEventPageData_getPlatformRevision_platform_events_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
}

export interface PlatformEventPageData_getPlatformRevision_platform_events {
  __typename: "PlatformEvent";
  /**
   * ID of the `PlatformEvent`
   */
  id: string;
  /**
   * Name of the `PlatformEvent`
   */
  name: string;
  /**
   * Description of the `PlatformEvent`
   */
  description: string;
  /**
   * Event that is being used
   */
  event: string;
  /**
   * List of `PlatformDataMap`s that create a document style key => value map. This can be directly accessed by the event when called.
   */
  platform_data_maps: PlatformEventPageData_getPlatformRevision_platform_events_platform_data_maps[];
}

export interface PlatformEventPageData_getPlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * A list of events that are associated with this `PlatformRevision`
   */
  platform_events: PlatformEventPageData_getPlatformRevision_platform_events[];
}

export interface PlatformEventPageData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: PlatformEventPageData_getPlatformRevision;
}

export interface PlatformEventPageDataVariables {
  id: string;
}
