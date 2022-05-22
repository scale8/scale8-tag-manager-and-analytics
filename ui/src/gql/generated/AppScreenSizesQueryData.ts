/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppScreenSizesQueryData
// ====================================================

export interface AppScreenSizesQueryData_getApp_screen_size_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppScreenSizesQueryData_getApp_screen_size_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppScreenSizesQueryData_getApp_screen_size_stats_result[];
}

export interface AppScreenSizesQueryData_getApp {
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
   * Screen Sizes
   */
  screen_size_stats: AppScreenSizesQueryData_getApp_screen_size_stats;
}

export interface AppScreenSizesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppScreenSizesQueryData_getApp;
}

export interface AppScreenSizesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
