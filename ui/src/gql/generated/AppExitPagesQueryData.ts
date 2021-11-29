/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppExitPagesQueryData
// ====================================================

export interface AppExitPagesQueryData_getApp_exit_page_stats_result {
  __typename: "AppGroupingCount";
  key: string;
  user_count: number;
  event_count: number;
}

export interface AppExitPagesQueryData_getApp_exit_page_stats {
  __typename: "AppGroupingCountsResponse";
  result: AppExitPagesQueryData_getApp_exit_page_stats_result[];
}

export interface AppExitPagesQueryData_getApp {
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
   * Exit Pages
   */
  exit_page_stats: AppExitPagesQueryData_getApp_exit_page_stats;
}

export interface AppExitPagesQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppExitPagesQueryData_getApp;
}

export interface AppExitPagesQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
