/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpdateEnvironmentGetData
// ====================================================

export interface UpdateEnvironmentGetData_getEnvironment_revision {
  __typename: "Revision";
  /**
   * Revision ID
   */
  id: string;
}

export interface UpdateEnvironmentGetData_getEnvironment {
  __typename: "Environment";
  /**
   * `Environment` ID
   */
  id: string;
  /**
   * `Environment` name
   */
  name: string;
  /**
   * `Environment` URL
   */
  url: string | null;
  /**
   * `Environment`'s custom domain name if configured
   */
  custom_domain: string | null;
  /**
   * `Revision` currently attached to the `Environment`
   */
  revision: UpdateEnvironmentGetData_getEnvironment_revision;
}

export interface UpdateEnvironmentGetData_getApp_revisions_tags {
  __typename: "Tag";
  /**
   * Tag ID
   */
  id: string;
}

export interface UpdateEnvironmentGetData_getApp_revisions_app_platform_revisions_platform_revision {
  __typename: "PlatformRevision";
  /**
   * ID of the `PlatformRevision`
   */
  id: string;
}

export interface UpdateEnvironmentGetData_getApp_revisions_app_platform_revisions {
  __typename: "AppPlatformRevision";
  /**
   * `AppPlatformRevision` ID
   */
  id: string;
  /**
   * `PlatformRevision` that is currently linked to this `AppPlatformRevision`
   */
  platform_revision: UpdateEnvironmentGetData_getApp_revisions_app_platform_revisions_platform_revision;
}

export interface UpdateEnvironmentGetData_getApp_revisions {
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
  tags: UpdateEnvironmentGetData_getApp_revisions_tags[];
  /**
   * Get all the `AppPlatformRevision`'s linked to this revision
   */
  app_platform_revisions: UpdateEnvironmentGetData_getApp_revisions_app_platform_revisions[];
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

export interface UpdateEnvironmentGetData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Revisions linked to the `App`. All `App` entities such as `Tag`, `RuleGroup`, `Rule` etc. sit under a revisioning system.
   */
  revisions: UpdateEnvironmentGetData_getApp_revisions[];
}

export interface UpdateEnvironmentGetData {
  /**
   * @bound=Environment
   * Get an `Environment` model from `Environment` ID
   */
  getEnvironment: UpdateEnvironmentGetData_getEnvironment;
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: UpdateEnvironmentGetData_getApp;
}

export interface UpdateEnvironmentGetDataVariables {
  id: string;
  appId: string;
}
