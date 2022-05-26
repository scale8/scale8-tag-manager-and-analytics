/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppBrowserVersionsQueryData
// ====================================================

export interface AppBrowserVersionsQueryData_getApp_browser_version_stats_result_key {
  __typename: "AppGroupingKeys";
  field: string;
  value: string;
}

export interface AppBrowserVersionsQueryData_getApp_browser_version_stats_result {
  __typename: "AppGroupingCompKeysCount";
  key: AppBrowserVersionsQueryData_getApp_browser_version_stats_result_key[];
  user_count: number;
  event_count: number;
}

export interface AppBrowserVersionsQueryData_getApp_browser_version_stats {
  __typename: "AppGroupingCompKeysCountsResponse";
  result: AppBrowserVersionsQueryData_getApp_browser_version_stats_result[];
}

export interface AppBrowserVersionsQueryData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Name of the Application
   */
  name: string;
  /**
   * Browsers Versions
   */
  browser_version_stats: AppBrowserVersionsQueryData_getApp_browser_version_stats;
}

export interface AppBrowserVersionsQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppBrowserVersionsQueryData_getApp;
}

export interface AppBrowserVersionsQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
