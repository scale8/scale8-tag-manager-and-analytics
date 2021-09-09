/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlatformDataContainerPageData
// ====================================================

export interface PlatformDataContainerPageData_getPlatformRevision_platform_data_containers_platform_data_maps {
  __typename: "PlatformDataMap";
  /**
   * ID of the `PlatformDataMap`
   */
  id: string;
}

export interface PlatformDataContainerPageData_getPlatformRevision_platform_data_containers {
  __typename: "PlatformDataContainer";
  /**
   * ID of the `PlatformDataContainer`
   */
  id: string;
  /**
   * Name of the `PlatformDataContainer`
   */
  name: string;
  /**
   * Whether or not to allow custom keys to be defined by the user to access properties within this data layer
   */
  allow_custom: boolean;
  /**
   * Description of the `PlatformDataContainer`
   */
  description: string;
  /**
   * A list of `PlatformDataMap` that describe the document style structure of this data layer
   */
  platform_data_maps: PlatformDataContainerPageData_getPlatformRevision_platform_data_containers_platform_data_maps[];
}

export interface PlatformDataContainerPageData_getPlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * A list of data containers (data layers) that are associated with this `PlatformRevision`
   */
  platform_data_containers: PlatformDataContainerPageData_getPlatformRevision_platform_data_containers[];
}

export interface PlatformDataContainerPageData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: PlatformDataContainerPageData_getPlatformRevision;
}

export interface PlatformDataContainerPageDataVariables {
  id: string;
}
