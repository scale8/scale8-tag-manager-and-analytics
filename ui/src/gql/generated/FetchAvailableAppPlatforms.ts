/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchAvailableAppPlatforms
// ====================================================

export interface FetchAvailableAppPlatforms_getApp_app_platforms_platform {
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

export interface FetchAvailableAppPlatforms_getApp_app_platforms {
  __typename: "AppPlatform";
  /**
   * `Platform` that is currently linked to this `AppPlatform`
   */
  platform: FetchAvailableAppPlatforms_getApp_app_platforms_platform;
}

export interface FetchAvailableAppPlatforms_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * All the platforms that a user has connected to (installed on) the `App`. The
   * is the master connected list that will appear in revised models.
   */
  app_platforms: FetchAvailableAppPlatforms_getApp_app_platforms[];
}

export interface FetchAvailableAppPlatforms_getPublicPlatforms {
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

export interface FetchAvailableAppPlatforms {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: FetchAvailableAppPlatforms_getApp;
  /**
   * @bound=Platform
   * Method will return a list of public `Platform`'s.
   * 
   * !> Note that if the `Platform` has not been made public it will not be in the list.
   */
  getPublicPlatforms: FetchAvailableAppPlatforms_getPublicPlatforms[];
}

export interface FetchAvailableAppPlatformsVariables {
  id: string;
}
