/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PlatformAssetPageData
// ====================================================

export interface PlatformAssetPageData_getPlatformRevision_platform_assets {
  __typename: "PlatformAsset";
  /**
   * ID of the `PlatformAsset`
   */
  id: string;
  /**
   * Name of the `PlatformAsset`
   */
  name: string;
  /**
   * Asset mime-type
   */
  mime_type: string;
  /**
   * Size of asset in bytes
   */
  size: number;
}

export interface PlatformAssetPageData_getPlatformRevision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * A list of assets that are associated with this `PlatformRevision`
   */
  platform_assets: PlatformAssetPageData_getPlatformRevision_platform_assets[];
}

export interface PlatformAssetPageData {
  /**
   * @bound=PlatformRevision
   * Returns a `PlatformRevision` associated withthe ID provided
   */
  getPlatformRevision: PlatformAssetPageData_getPlatformRevision;
}

export interface PlatformAssetPageDataVariables {
  id: string;
}
