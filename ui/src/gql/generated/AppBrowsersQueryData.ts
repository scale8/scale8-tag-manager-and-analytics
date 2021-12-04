/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppBrowsersQueryData
// ====================================================

export interface AppBrowsersQueryData_getApp_browser_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppBrowsersQueryData_getApp_browser_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppBrowsersQueryData_getApp_browser_stats_result[];
}

export interface AppBrowsersQueryData_getApp {
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
   * Browsers
   */
  browser_stats: AppBrowsersQueryData_getApp_browser_stats;
}

export interface AppBrowsersQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppBrowsersQueryData_getApp;
}

export interface AppBrowsersQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
