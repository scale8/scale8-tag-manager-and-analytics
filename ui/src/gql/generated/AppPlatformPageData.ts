/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppPlatformPageData
// ====================================================

export interface AppPlatformPageData_getApp_app_platforms_platform {
  __typename: "Platform";
  /**
   * `Platform` ID
   */
  id: string;
  /**
   * `Platform` name
   */
  name: string;
  /**
   * Date the `Platform` was created at
   */
  created_at: S8DateTime;
  /**
   * Date the `Platform` was last updated at
   */
  updated_at: S8DateTime;
}

export interface AppPlatformPageData_getApp_app_platforms {
  __typename: "AppPlatform";
  /**
   * `Platform` that is currently linked to this `AppPlatform`
   */
  platform: AppPlatformPageData_getApp_app_platforms_platform;
}

export interface AppPlatformPageData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * All the platforms that a user has connected to (installed on) the `App`. The is the master connected list that will appear in revised models.
   */
  app_platforms: AppPlatformPageData_getApp_app_platforms[];
}

export interface AppPlatformPageData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppPlatformPageData_getApp;
}

export interface AppPlatformPageDataVariables {
  id: string;
}
