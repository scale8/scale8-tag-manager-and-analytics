/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppPlatformRevisionPageData
// ====================================================

export interface AppPlatformRevisionPageData_getRevision_app_platform_revisions_platform_revision_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
}

export interface AppPlatformRevisionPageData_getRevision_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
  /**
   * The name of the `PlatformRevision`
   */
  name: string;
  /**
   * The `Platform` that owns this `PlatformRevision`
   */
  platform: AppPlatformRevisionPageData_getRevision_app_platform_revisions_platform_revision_platform;
  /**
   * Whether or not the `PlatformRevision` has been locked or not. When locked no
   * future changes can be made to the `PlatformRevision` or any of its connected entities
   */
  locked: boolean;
}

export interface AppPlatformRevisionPageData_getRevision_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * The date the `AppPlatformRevision` was created at
   */
  created_at: S8DateTime;
  /**
   * The date the `AppPlatformRevision` was last updated at
   */
  updated_at: S8DateTime;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: AppPlatformRevisionPageData_getRevision_app_platform_revisions_platform_revision;
}

export interface AppPlatformRevisionPageData_getRevision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: AppPlatformRevisionPageData_getRevision_app_platform_revisions[];
}

export interface AppPlatformRevisionPageData {
  /**
   * @bound=Revision
   * Finds a Revision By Id
   */
  getRevision: AppPlatformRevisionPageData_getRevision;
}

export interface AppPlatformRevisionPageDataVariables {
  id: string;
}
