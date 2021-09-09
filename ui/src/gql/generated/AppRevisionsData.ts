/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppRevisionsData
// ====================================================

export interface AppRevisionsData_getApp_revisions_tags {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
}

export interface AppRevisionsData_getApp_revisions_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
}

export interface AppRevisionsData_getApp_revisions_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: AppRevisionsData_getApp_revisions_app_platform_revisions_platform_revision;
}

export interface AppRevisionsData_getApp_revisions {
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
   * Get all the tags linked to this revision
   */
  tags: AppRevisionsData_getApp_revisions_tags[];
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: AppRevisionsData_getApp_revisions_app_platform_revisions[];
  /**
   * Revision has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * Revision Creation Time
   */
  created_at: S8DateTime;
  /**
   * Revision Last Update Time
   */
  updated_at: S8DateTime;
}

export interface AppRevisionsData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: AppRevisionsData_getApp_revisions[];
}

export interface AppRevisionsData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppRevisionsData_getApp;
}

export interface AppRevisionsDataVariables {
  id: string;
}
